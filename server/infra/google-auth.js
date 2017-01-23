import settings from '../settings';
import { fetchJson } from './net';


export const getTokensFromCode = oauth2Client => code => {
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


export const getTokenInfo = accessToken => {
  const INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
  const url = INFO_URL + '?access_token=' + accessToken;
  return fetchJson(url);
};


export const getProfile = accessToken => {
  let url = 'https://www.googleapis.com/plus/v1/people/me';
  url += '?access_token=' + accessToken;
  url += '&key=' + settings.keys.google_apiKey;
  return fetchJson(url);
};
