import * as types from '../actions/types';

const initialState = {
  isLoading: false,
  jwt: undefined,
  error: undefined,
};


const auth = (state = initialState, action) => {
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
};

export default auth;
