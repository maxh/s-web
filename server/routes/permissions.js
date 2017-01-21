import express from 'express';
import google from 'googleapis';

import { endpoint } from '../infra/net';
import settings from '../settings';


const OAuth2 = google.auth.OAuth2;

const router = express.Router();


const setPermission = (provider, providerInfo) => {
  const url = settings.scoutServiceUrl + '/permissions/' + provider;
  params.scoutWebServerSecret = 'foo';
  const options = {
    method: 'POST',
    body: JSON.stringify(providerInfo),
    headers: {'content-type': 'application/json'},
  };
  return fetch(url, options).then(response => {
    return response.json().then(json => {
      if (!response.ok) {
        throw Error(json.error);
      }
      return json;
    });
  });
};


// Google.


router.get('/google', endpoint((req, res) => {
  const { onSuccess, onFailure } = req.query;
  req.session.onSuccess = onSuccess;
  req.session.onFailure = onFailure;

  const { scopes } = req.params;

  const redirectPath = '/permissions/google/callback';
  const oauth2Client = new OAuth2(
    settings.keys.googleClientId,
    settings.keys.googleClientSecret,
    settings.serverUrl + redirectPath,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  return res.redirect(url);
}));

router.get('/google/callback', endpoint((req, res) => {
  const { code } = req.query;

  const tokensPromise = getTokensFromCode(code);
  const tokenInfoPromise = tokensPromise.then(tokens => getTokenInfo(tokens.accessToken));
  const promises = Promise.all([ tokensPromise, tokenInfoPromise ]);

  const permissionPromise = promises.then((values) => {
    const [ tokens, tokenInfo ] = values;
    const providerInfo = {
      googleId: profile.id,
      scopes: tokenInfo.scopes.split(' '),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiration: tokens.accessTokenExpiration,
    };
    return setPermission('google', providerInfo);
  });

  const destinationPromise = permissionPromise.then(() => {
    return req.session.onSuccess;
  }).catch(error => {
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
