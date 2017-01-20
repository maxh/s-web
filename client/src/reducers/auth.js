import * as types from '../actions/types';

const auth = (state = {
  isLoading: false,
  jwt: undefined,
  error: undefined,
}, action) => {
  switch (action.type) {
    case types.AUTH_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.AUTH_RECEIVED:
      return {
        isLoading: false,
        jwt: action.jwt,
        error: undefined,
      };
    case types.AUTH_ERROR:
      return {
        isLoading: false,
        jwt: undefined,
        error: action.error,
      };
    default:
      return state;
  }
}

export default auth;
