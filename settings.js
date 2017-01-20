const settings = {};

settings.port = 3001;

if (process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging') {
  settings.serverUrl = '';
  settings.clientServerUrl = settings.serverUrl;
  settings.scoutServiceUrl = '';
} else {
  settings.serverUrl = 'http://localhost:3001';
  settings.clientServerUrl = 'http://localhost:3000';  // React's dev server uses different port.
  settings.scoutServiceUrl = 'http://localhost:5000';
}

module.exports = settings;
