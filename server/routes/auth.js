import express from 'express';
import google from 'googleapis';

import { endpoint } from '../infra/net';
import settings from '../settings';


const OAuth2 = google.auth.OAuth2;

const REDIRECT_PATH = '/auth/callback';

const oauth2Client = new OAuth2(
  settings.keys.googleClientId,
  settings.keys.googleClientSecret,
  settings.serverUrl + REDIRECT_PATH,
);

const INITIAL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];


const getJwtPromise = (params) => {
  const url = settings.scoutServiceUrl + '/auth/jwt';
  params.scoutWebServerSecret = 'foo';
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {'content-type': 'application/json'},
  };
  return fetch(url, options).then(response => {
    return response.json().then(json => {
      if (!response.ok) {
        throw Error(json.error);
      }
      return json.jwt;
    });
  });
};


export const getTokensFromCode = function(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        accessTokenExpiration: tokens.expiry_date / 1000,  // ms => secs
      });
    });
  });
};

const getProfile = (accessToken) => {
  const INFO_URL = 'https://www.googleapis.com/plus/v1/people/me';
  const url = INFO_URL + '?access_token=' + accessToken + '&key=' + 'AIzaSyCaXnRt4J82cRuseQR98IngQJRyMJCPnWw';
  return fetch(url).then(response => {
    return response.json().then(json => {
      return json;
    });
  });
}

const getScopes = (accessToken) => {
  const INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
  const url = INFO_URL + '?access_token=' + accessToken;
  return fetch(url).then(response => {
    return response.json().then(json => {
      return json.scope.split(' ');
    });
  });
}


const router = express.Router();


router.get('/sign-in', endpoint((req, res) => {
  const { onSuccess, onFailure } = req.query;
  req.session.onSuccess = onSuccess;
  req.session.onFailure = onFailure;

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: INITIAL_SCOPES
  });

  return res.redirect(url);
}));


const NO_REFRESH_TOKEN = 'No refresh token!';


router.get('/callback', endpoint((req, res) => {
  const { code } = req.query;

  const tokensPromise = getTokensFromCode(code);
  const scopesPromise = tokensPromise.then(tokens => getScopes(tokens.accessToken));
  const profilePromise = tokensPromise.then(tokens => getProfile(tokens.accessToken));

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

  const destinationPromise = jwtPromise.then(jwt => {
    res.cookie('jwt', jwt);
    return req.session.onSuccess;
  }).catch(error => {
    if (error.message === NO_REFRESH_TOKEN) {
      const forceRefreshUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: INITIAL_SCOPES
      });
      return res.redirect(forceRefreshUrl);
    }
    return req.session.onFailure;
  });

  return destinationPromise.then((destination) => {
    delete req.session.onSuccess;
    delete req.session.onFailure;
    const url = settings.clientServerUrl + destination;
    res.redirect(url);
  });
}));

export default router;
