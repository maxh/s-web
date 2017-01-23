import express from 'express';
import google from 'googleapis';

import * as googleAuth from '../infra/google-auth';
import { endpoint, fetchJson } from '../infra/net';
import settings from '../settings';


const OAuth2 = google.auth.OAuth2;

const REDIRECT_PATH = '/auth/callback';
const oauth2Client = new OAuth2(
  settings.keys.google_clientId,
  settings.keys.google_clientSecret,
  settings.serverUrl + REDIRECT_PATH,
);
const getTokensFromCode = googleAuth.getTokensFromCode(oauth2Client);

const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

const NO_REFRESH_TOKEN = 'No refresh token!';


const getJwtPromise = (params) => {
  const url = `${settings.scoutServiceUrl}/auth/jwt/fromtokens`;
  params.scoutWebServerSecret = settings.keys.scoutWebServerSecret;
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'content-type': 'application/json' },
  };
  return fetch(url, options, false).then(response => {
    return response.json().then(json => {
      if (!response.ok) {
        throw Error(json.error);  // Might be NO_REFRESH_TOKEN
      }
      return json.jwt;
    });
  });
};


const router = express.Router();


router.get('/sign-in', endpoint((req, res) => {
  const { destination } = req.query;
  req.session.destination = destination;

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: INITIAL_SCOPES,
  });

  return res.redirect(url);
}));


router.get('/callback', endpoint((req, res) => {
  const { code } = req.query;
  const { destination } = req.session;

  const tokensPromise = getTokensFromCode(code);
  const scopesPromise = tokensPromise
      .then(tokens => googleAuth.getTokenInfo(tokens.accessToken))
      .then(tokenInfo => tokenInfo.scope.split(' '));
  const profilePromise = tokensPromise
      .then(tokens => googleAuth.getProfile(tokens.accessToken));

  const promises = Promise.all([tokensPromise, scopesPromise, profilePromise]);

  const jwtPromise = promises.then((values) => {
    const [tokens, scopes, profile] = values;
    const params = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      scopes,
      tokens,
    };
    return getJwtPromise(params);
  });

  return jwtPromise.then((jwt) => {
    res.session = null;
    res.cookie('jwt', jwt);
    res.redirect(settings.clientServerUrl + destination);
  }).catch((error) => {
    if (error.message === NO_REFRESH_TOKEN) {
      const forceRefreshUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: INITIAL_SCOPES,
      });
      res.redirect(forceRefreshUrl);
    }
    // eslint-disable-next-line no-console
    console.error('Error signing in: ', error);
  });
}));

export default router;
