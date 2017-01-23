import * as types from '../actions/types';


const initialState = {
  isLoading: false,
  current: null,
};

function permissions(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_PERMISSIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case types.LOAD_PERMISSIONS_SUCCESS:
      return {
        isLoading: false,
        current: action.response,
        error: undefined,
      };
    case types.LOAD_PERMISSIONS_FAILURE:
      return {
        isLoading: false,
        current: null,
        error: action.error,
      };
    default:
      return state;
  }
}

export default permissions;
