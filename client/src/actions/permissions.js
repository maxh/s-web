import { CALL_API } from '../middleware/api';
import * as types from './types';


const loadPermissions = () => ({
  [CALL_API]: {
    types: [
      types.LOAD_PERMISSIONS_REQUEST,
      types.LOAD_PERMISSIONS_SUCCESS,
      types.LOAD_PERMISSIONS_FAILURE,
    ],
    endpoint: '/permissions',
    method: 'GET',
  },
});

export {
  loadPermissions,
};
