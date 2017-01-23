// Permissions for third-party services.

// We do this here instead of in scout-service because we cannot pass JWT to

import crypto from 'crypto';
import express from 'express';
import google from 'googleapis';
import queryString from 'query-string';

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
  req.session.savedState = crypto.randomBytes(20).toString('hex');

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
  const { code, error, state } = req.query;

  const { jwt, destination, savedState } = req.session;
  req.session = null;

  const next = () => res.redirect(settings.clientServerUrl + destination);
  if (error || savedState !== state) {
    next();
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

  return permissionPromise.then(next).catch(next);
}));


// Dropbox permissions.


router.get('/dropbox', endpoint((req, res) => {
  const { destination } = req.query;

  req.session.destination = destination;
  req.session.jwt = req.cookies.jwt;
  req.session.savedState = crypto.randomBytes(20).toString('hex');

  const params = {
    client_id: settings.keys.dropbox_clientId,
    redirect_uri: settings.serverUrl + redirectPath,
    response_type: 'code',
    state: req.session.state,
  };
  const stringified = queryString.stringify(params);
  const url = `https://www.dropbox.com/1/oauth2/authorize?${stringified}`;

  return res.redirect(url);
}));

// Note: Does NOT require an auth header.
// TODO: Add localhost:3001/permissions/callback/dropbox as an authorized URI on
// https://www.dropbox.com/developers/apps
router.get('/callback/dropbox', endpoint((req, res) => {
  const { code, state, error } = req.query;

  const { jwt, destination, savedState } = req.session;
  req.session = null;

  const next = () => res.redirect(settings.clientServerUrl + destination);
  if (error || savedState !== state) {
    next();
  }

  const url = 'https://api.dropboxapi.com/1/oauth2/token';
  const content = {
    code,
    grant_type: 'authorization_code',
    client_id: settings.keys.dropbox_clientId,
    client_secret: settings.keys.dropbox_clientSecret,
  };
  const options = {
    body: JSON.stringify(content),
    method: 'POST',
  };

  return fetchJson(url, options)
      .then((token) => {
        const providerInfo = {
          accessToken: token.access_token,
          accountId: token.account_id,
        };
        return setPermission(jwt, 'dropbox', providerInfo);
      })
      .then(next)
      .catch(next);
}));

export default router;
