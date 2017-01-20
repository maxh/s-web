import cookie from 'cookie';

import settings from '../../../settings';
import * as types from './types';



const startSignIn = () => {
  const endpoint = settings.serverUrl + '/auth/sign-in';
  window.location = endpoint + '?onSuccess=/&onFailure=/sign-in';
  return {
    type: types.AUTH_REQUEST
  };
};

const extractJwtFromCookie = () => {
  return (dispatch, getState) => {
    const cookies = cookie.parse(document.cookie);
    if (cookies.jwt) {
      return dispatch({
        type: types.AUTH_RECEIVED,
        jwt: cookies.jwt,
      });
    }
  }
};

export {
  extractJwtFromCookie,
  startSignIn
};
