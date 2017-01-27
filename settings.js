const settings = {};

settings.isDev = !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging');

if (settings.isDev) {
  settings.port = 3001;
  settings.serverUrl = 'http://localhost:' + settings.port;
  settings.clientServerUrl = 'http://localhost:3000';  // React's dev server uses different port.
  settings.scoutServiceUrl = 'http://localhost:5000';
} else {
  settings.port = process.env.PORT;
  settings.serverUrl = 'https://' + process.env.HOSTNAME;
  settings.scoutServiceUrl = 'https://scout-service.herokuapp.com';
  settings.clientServerUrl = settings.serverUrl;
}

module.exports = settings;
