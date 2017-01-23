// Permissions for third-party services.

// We do this here instead of in scout-service because we cannot pass JWT to

import * as express from 'express';
import * as google from 'googleapis';

import * as googleAuth from '../infra/google-auth';
import { endpoint, fetchJson } from '../infra/net';

import settings from '../../settings';


const OAuth2 = google.auth.OAuth2;


// Permissions for third-party services.


const router = express.Router();


const setPermission = (jwt, provider, providerInfo) => {
  const params = {
    scoutWebServerSecret: settings.keys.scoutWebServerSecret,
    provider,
    providerInfo,
  };
  const options = {
    method: 'PATCH',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      authorization: `Scout JWT ${jwt}`,
    },
  };
  const url = `${settings.scoutServiceUrl}/api/permissions/`;
  return fetchJson(url, options).then(() => ({}));
};


// Google permissions.


const redirectPath = '/permissions/callback/google';
const oauth2Client = new OAuth2(
  settings.keys.google_clientId,
  settings.keys.google_clientSecret,
  settings.serverUrl + redirectPath,
);
const getTokensFromCode = googleAuth.getTokensFromCode(oauth2Client);

router.get('/google', endpoint((req, res) => {
  const { destination, providerInfo } = req.query;

  req.session.destination = destination;
  req.session.jwt = req.cookies.jwt;

  const scopes = JSON.parse(providerInfo).scopes;

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  return res.redirect(url);
}));

// Note: Does NOT require an auth header.
router.get('/callback/google', endpoint((req, res) => {
  const { code, error } = req.query;

  const { jwt, destination } = req.session;
  req.session = null;

  if (error) {
    res.redirect(settings.clientServerUrl + destination);
  }

  const tokensPromise = getTokensFromCode(code);
  const tokenInfoPromise = tokensPromise
      .then(tokens => googleAuth.getTokenInfo(tokens.accessToken));
  const promises = Promise.all([tokensPromise, tokenInfoPromise]);

  const permissionPromise = promises.then((values) => {
    const [tokens, tokenInfo] = values;
    const providerInfo = {
      scopes: tokenInfo.scope.split(' '),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiration: tokens.accessTokenExpiration,
    };
    return setPermission(jwt, 'google', providerInfo);
  });

  return permissionPromise.then(() => {
    res.redirect(settings.clientServerUrl + destination);
  });
}));


export default router;
