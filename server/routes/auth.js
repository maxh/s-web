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


const getJwtPromise = (params) => {
  const url = settings.scoutServiceUrl + '/auth/jwt/fromtokens';
  params.scoutWebServerSecret = settings.scoutWebServerSecret;
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {'content-type': 'application/json'},
  };
  return fetchJson(url, options).then(json => json.jwt);
};


const router = express.Router();


router.get('/sign-in', endpoint((req, res) => {
  const { destination } = req.query;
  req.session.destination = destination;

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: INITIAL_SCOPES
  });

  return res.redirect(url);
}));


const NO_REFRESH_TOKEN = 'No refresh token!';


router.get('/callback', endpoint((req, res) => {
  const { code } = req.query;
  const { destination } = req.session;
  req.session = null;

  const tokensPromise = getTokensFromCode(code);
  const scopesPromise = tokensPromise
      .then(tokens => googleAuth.getTokenInfo(tokens.accessToken))
      .then(tokenInfo => tokenInfo.scope.split(' '));
  const profilePromise = tokensPromise
      .then(tokens => googleAuth.getProfile(tokens.accessToken));

  const promises = Promise.all([tokensPromise, scopesPromise, profilePromise]);

  const jwtPromise = promises.then(values => {
    const [ tokens, scopes, profile ] = values;
    const params = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      scopes,
      tokens
    }
    return getJwtPromise(params);
  });

  const donePromise = jwtPromise.then(jwt => {
    res.cookie('jwt', jwt);
  }).catch(error => {
    if (error.message === NO_REFRESH_TOKEN) {
      const forceRefreshUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: INITIAL_SCOPES
      });
      return res.redirect(forceRefreshUrl);
    }
    console.error('Error signing in: ', error);
  });

  return donePromise.then(() => res.redirect(destination));
}));

export default router;
