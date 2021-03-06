// Permission management across providers.


import { CALL_API } from '../middleware/api';
import * as types from './types';

import settings from '../settings';

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

const setPermission = (provider, providerInfo = {}) => {
  const endpoint = `/permissions/${provider}`;
  const serialized = encodeURIComponent(JSON.stringify(providerInfo));
  let url = `${endpoint}?destination=/&providerInfo=${serialized}`;
  if (settings.isDev) {
    url = settings.serverUrl + url;
  }
  window.location = url;
  return { type: types.SET_PERMISSION_REQUEST };
};

export {
  setPermission,
  loadPermissions,
};
