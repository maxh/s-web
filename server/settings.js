import settings from '../settings';

settings.keys = JSON.parse(process.env.AUTH_KEYS);

export default settings;
