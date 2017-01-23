import settings from '../settings';


if (process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging') {
  settings.keys = JSON.parse(process.env.AUTH_KEYS);
} else {
  // eslint-disable-next-line global-require
  settings.keys = require('../keys/keys.json');
}

export default settings;
