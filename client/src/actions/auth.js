// Initial user authentication.

import cookie from 'cookie';

import settings from '../settings';
import * as types from './types';


const ONE_HOUR_MS = 60 * 60 * 1000;

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const startSignIn = () => {
  window.location = `${settings.serverUrl}/auth/sign-in?destination=/`;
  return { type: types.AUTH_REQUEST };
};

const extractJwtFromCookie = () => {
  return (dispatch, getState) => {
    const cookies = cookie.parse(document.cookie);
    if (cookies.jwt) {
      const encoded = cookies.jwt.split('.')[1];
      const decoded = atob(encoded);
      const payload = JSON.parse(decoded);
      const expirationTimeMs = payload.exp * 1000;
      const hourFromNowMs = (new Date()).getTime() + ONE_HOUR_MS;
      if (expirationTimeMs < hourFromNowMs) {
        deleteCookie('jwt');
        return;
      }
      // eslint-disable-next-line consistent-return
      return dispatch({
        type: types.AUTH_RECEIVED,
        jwt: cookies.jwt,
      });
    }
  };
};

export {
  extractJwtFromCookie,
  startSignIn,
};
