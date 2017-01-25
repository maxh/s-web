// Permissions for third-party services.

// We do this here instead of in scout-service because we cannot pass JWT to

import crypto from 'crypto';
import express from 'express';
import google from 'googleapis';
import queryString from 'query-string';
import request from 'request';

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
    state: req.session.savedState,
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

const dropboxRedirectUri = `${settings.serverUrl}/permissions/callback/dropbox`;
router.get('/dropbox', endpoint((req, res) => {
  const { destination } = req.query;

  req.session.destination = destination;
  req.session.jwt = req.cookies.jwt;
  req.session.savedState = crypto.randomBytes(20).toString('hex');

  const params = {
    client_id: settings.keys.dropbox_clientId,
    redirect_uri: dropboxRedirectUri,
    response_type: 'code',
    state: req.session.savedState,
  };
  const stringified = queryString.stringify(params);
  const url = `https://www.dropbox.com/oauth2/authorize?${stringified}`;

  return res.redirect(url);
}));

// Note: Does NOT require an auth header.
router.get('/callback/dropbox', endpoint((req, res) => {
  const { code, state, error } = req.query;

  const { jwt, destination, savedState } = req.session;
  req.session = null;

  const destinationUrl = settings.clientServerUrl + destination;
  if (error || savedState !== state) {
    res.redirect(destinationUrl);
  }


  const tokenPromise = new Promise((resolve, reject) => {
    request.post('https://api.dropbox.com/1/oauth2/token', {
      form: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: dropboxRedirectUri,
      },
      auth: {
        user: settings.keys.dropbox_clientId,
        pass: settings.keys.dropbox_clientSecret,
      },
    }, (reqError, response, body) => {
      if (reqError) {
        reject(reqError);
        return;
      }
      resolve(JSON.parse(body));
    });
  });

  return tokenPromise
      .then((token) => {
        const providerInfo = {
          accessToken: token.access_token,
          accountId: token.account_id,
        };
        return setPermission(jwt, 'dropbox', providerInfo);
      })
      .then(() => res.redirect(destinationUrl))
      .catch(err => res.redirect(`${destinationUrl}?error=${err}`));
}));

export default router;
