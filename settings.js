const settings = {};

if (process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging') {
  settings.port = process.env.PORT;
  settings.serverUrl = 'https://' + process.env.HOSTNAME;
  settings.clientServerUrl = settings.serverUrl;
  settings.scoutServiceUrl = 'https://scout-service.herokuapp.com';
} else {
  settings.port = 3001;
  settings.serverUrl = 'http://localhost:' + settings.port;
  settings.clientServerUrl = 'http://localhost:3000';  // React's dev server uses different port.
  settings.scoutServiceUrl = 'http://localhost:5000';
}

module.exports = settings;
