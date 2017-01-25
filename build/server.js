require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _bodyParser = __webpack_require__(/*! body-parser */ 1);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _express = __webpack_require__(/*! express */ 2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _cookieParser = __webpack_require__(/*! cookie-parser */ 3);
	
	var _cookieParser2 = _interopRequireDefault(_cookieParser);
	
	var _cookieSession = __webpack_require__(/*! cookie-session */ 4);
	
	var _cookieSession2 = _interopRequireDefault(_cookieSession);
	
	var _morgan = __webpack_require__(/*! morgan */ 5);
	
	var _morgan2 = _interopRequireDefault(_morgan);
	
	var _auth = __webpack_require__(/*! ./routes/auth */ 6);
	
	var _auth2 = _interopRequireDefault(_auth);
	
	var _permissions = __webpack_require__(/*! ./routes/permissions */ 14);
	
	var _permissions2 = _interopRequireDefault(_permissions);
	
	var _settings = __webpack_require__(/*! ./settings */ 9);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var app = (0, _express2.default)();
	
	app.use((0, _cookieParser2.default)());
	app.use((0, _cookieSession2.default)({ secret: _settings2.default.keys.scoutWebSessionKey }));
	
	if (!_settings2.default.isDev) {
	  app.use(_express2.default.static('client/build'));
	}
	
	var forceHttpsUnlessDev = function forceHttpsUnlessDev(req, res, next) {
	  if (!_settings2.default.isDev && _settings2.default.isHeroku && req.header('x-forwarded-proto') !== 'https') {
	    return res.redirect('https://' + req.header('host') + req.url);
	  }
	  return next();
	};
	app.use(forceHttpsUnlessDev);
	app.use(_bodyParser2.default.json());
	app.use((0, _morgan2.default)('combined'));
	
	app.use('/auth', _auth2.default);
	app.use('/permissions', _permissions2.default);
	
	app.listen(_settings2.default.port, function () {
	  // eslint-disable-next-line no-console
	  console.log('Server listening on: ', _settings2.default.port);
	});

/***/ },
/* 1 */
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 2 */
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 4 */
/*!*********************************!*\
  !*** external "cookie-session" ***!
  \*********************************/
/***/ function(module, exports) {

	module.exports = require("cookie-session");

/***/ },
/* 5 */
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 6 */
/*!*******************************!*\
  !*** ./server/routes/auth.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _express = __webpack_require__(/*! express */ 2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _googleapis = __webpack_require__(/*! googleapis */ 7);
	
	var _googleapis2 = _interopRequireDefault(_googleapis);
	
	var _googleAuth = __webpack_require__(/*! ../infra/google-auth */ 8);
	
	var googleAuth = _interopRequireWildcard(_googleAuth);
	
	var _net = __webpack_require__(/*! ../infra/net */ 12);
	
	var _settings = __webpack_require__(/*! ../settings */ 9);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var OAuth2 = _googleapis2.default.auth.OAuth2;
	
	var REDIRECT_PATH = '/auth/callback';
	var oauth2Client = new OAuth2(_settings2.default.keys.google_clientId, _settings2.default.keys.google_clientSecret, _settings2.default.serverUrl + REDIRECT_PATH);
	var getTokensFromCode = googleAuth.getTokensFromCode(oauth2Client);
	
	var INITIAL_SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
	
	var NO_REFRESH_TOKEN = 'No refresh token!';
	
	var getJwtPromise = function getJwtPromise(params) {
	  var url = _settings2.default.scoutServiceUrl + '/auth/jwt/fromtokens';
	  params.scoutWebServerSecret = _settings2.default.keys.scoutWebServerSecret;
	  var options = {
	    method: 'POST',
	    body: JSON.stringify(params),
	    headers: { 'content-type': 'application/json' }
	  };
	  // Use raw fetch instead of fetchJson to handle the NO_REFRESH_TOKEN case.
	  return fetch(url, options, false).then(function (response) {
	    return response.json().then(function (json) {
	      if (!response.ok) {
	        throw Error(json.error); // Might be NO_REFRESH_TOKEN
	      }
	      return json.jwt;
	    });
	  });
	};
	
	var router = _express2.default.Router();
	
	router.get('/sign-in', (0, _net.endpoint)(function (req, res) {
	  var destination = req.query.destination;
	
	  req.session.destination = destination;
	
	  var url = oauth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: INITIAL_SCOPES
	  });
	
	  return res.redirect(url);
	}));
	
	router.get('/callback', (0, _net.endpoint)(function (req, res) {
	  var code = req.query.code;
	  var destination = req.session.destination;
	
	
	  var tokensPromise = getTokensFromCode(code);
	  var scopesPromise = tokensPromise.then(function (tokens) {
	    return googleAuth.getTokenInfo(tokens.accessToken);
	  }).then(function (tokenInfo) {
	    return tokenInfo.scope.split(' ');
	  });
	  var profilePromise = tokensPromise.then(function (tokens) {
	    return googleAuth.getProfile(tokens.accessToken);
	  });
	
	  var promises = Promise.all([tokensPromise, scopesPromise, profilePromise]);
	
	  var jwtPromise = promises.then(function (values) {
	    var _values = _slicedToArray(values, 3),
	        tokens = _values[0],
	        scopes = _values[1],
	        profile = _values[2];
	
	    var params = {
	      googleId: profile.id,
	      email: profile.emails[0].value,
	      name: profile.displayName,
	      scopes: scopes,
	      tokens: tokens
	    };
	    return getJwtPromise(params);
	  });
	
	  return jwtPromise.then(function (jwt) {
	    res.session = null;
	    res.cookie('jwt', jwt);
	    res.redirect(_settings2.default.clientServerUrl + destination);
	  }).catch(function (error) {
	    if (error.message === NO_REFRESH_TOKEN) {
	      var forceRefreshUrl = oauth2Client.generateAuthUrl({
	        access_type: 'offline',
	        prompt: 'consent',
	        scope: INITIAL_SCOPES
	      });
	      res.redirect(forceRefreshUrl);
	    }
	    // eslint-disable-next-line no-console
	    console.error('Error signing in: ', error);
	  });
	}));
	
	exports.default = router;

/***/ },
/* 7 */
/*!*****************************!*\
  !*** external "googleapis" ***!
  \*****************************/
/***/ function(module, exports) {

	module.exports = require("googleapis");

/***/ },
/* 8 */
/*!*************************************!*\
  !*** ./server/infra/google-auth.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getProfile = exports.getTokenInfo = exports.getTokensFromCode = undefined;
	
	var _settings = __webpack_require__(/*! ../settings */ 9);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	var _net = __webpack_require__(/*! ./net */ 12);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var getTokensFromCode = exports.getTokensFromCode = function getTokensFromCode(oauth2Client) {
	  return function (code) {
	    return new Promise(function (resolve, reject) {
	      oauth2Client.getToken(code, function (err, tokens) {
	        if (err) {
	          reject(err);
	          return;
	        }
	        resolve({
	          refreshToken: tokens.refresh_token,
	          accessToken: tokens.access_token,
	          accessTokenExpiration: tokens.expiry_date / 1000 });
	      });
	    });
	  };
	};
	
	var getTokenInfo = exports.getTokenInfo = function getTokenInfo(accessToken) {
	  var INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
	  var url = INFO_URL + '?access_token=' + accessToken;
	  return (0, _net.fetchJson)(url);
	};
	
	var getProfile = exports.getProfile = function getProfile(accessToken) {
	  var url = 'https://www.googleapis.com/plus/v1/people/me';
	  url += '?access_token=' + accessToken;
	  url += '&key=' + _settings2.default.keys.google_apiKey;
	  return (0, _net.fetchJson)(url);
	};

/***/ },
/* 9 */
/*!****************************!*\
  !*** ./server/settings.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _settings = __webpack_require__(/*! ../settings */ 10);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	if (process.env.AUTH_KEYS) {
	  _settings2.default.keys = JSON.parse(process.env.AUTH_KEYS);
	} else {
	  // eslint-disable-next-line global-require
	  _settings2.default.keys = __webpack_require__(/*! ../keys/keys.json */ 11);
	}
	
	exports.default = _settings2.default;

/***/ },
/* 10 */
/*!*********************!*\
  !*** ./settings.js ***!
  \*********************/
/***/ function(module, exports) {

	const settings = {};
	
	settings.isDev = !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging');
	settings.isHeroku = process.env.PORT;
	
	if (settings.isDev) {
	  settings.port = 3001;
	  settings.serverUrl = 'http://localhost:' + settings.port;
	  settings.clientServerUrl = 'http://localhost:3000';  // React's dev server uses different port.
	  settings.scoutServiceUrl = 'http://localhost:5000';
	} else {
	  if (settings.isHeroku) {
	    // Actual prod.
	    settings.port = process.env.PORT;
	    settings.serverUrl = 'https://' + process.env.HOSTNAME;
	    settings.scoutServiceUrl = 'https://scout-service.herokuapp.com';
	  } else {
	    // Compiled prod run locally.
	    settings.port = 3001;
	    settings.serverUrl = 'http://localhost:3001';
	    settings.scoutServiceUrl = 'http://localhost:5000';
	  }
	  settings.clientServerUrl = settings.serverUrl;
	}
	
	module.exports = settings;


/***/ },
/* 11 */
/*!************************!*\
  !*** ./keys/keys.json ***!
  \************************/
/***/ function(module, exports) {

	module.exports = {
		"dark_sky": "61ae0da07a6ba575cf52b3a183bbcbbd",
		"gmaps": "AIzaSyCaXnRt4J82cRuseQR98IngQJRyMJCPnWw",
		"nyt": "3060d0e08cb9494f8ff10db9461552f6",
		"google_clientId": "447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com",
		"google_clientSecret": "1dhLvo_grF0yCM_XVM8OyogN",
		"google_apiKey": "AIzaSyCaXnRt4J82cRuseQR98IngQJRyMJCPnWw",
		"dropbox_clientId": "dg3od5r6l2xuy1a",
		"dropbox_clientSecret": "1at9hla0qjies73",
		"jwtSecret": "cNWBAsajXfBhbFZ0sQsGfQVkIlzslJh5WEmOEDOts421O7AvEsVfyVuihTb",
		"scoutWebServerSecret": "sSkCNyf93qA5ZNG9GHbBDFTMLrWx9DMjRodCN9oFb90hicys06zj8lmxbbvA",
		"scoutWebSessionKey": "CtBjTxYgz6cMCeaMXNYFrfGa5WTcQwgNs7C0T2JYEzcURmzXuwMXUc1e8IRptHkBKDHTR0rTvllNBxhP"
	};

/***/ },
/* 12 */
/*!*****************************!*\
  !*** ./server/infra/net.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fetchJson = exports.endpoint = undefined;
	
	__webpack_require__(/*! isomorphic-fetch */ 13);
	
	// A handler wrapper that allows handlers to return promises
	// instead of dealing with req and res. Also, centralizes
	// rejection and error handling and attaches convenience methods.
	var endpoint = exports.endpoint = function endpoint(fn) {
	  var wrapper = function wrapper(req, res) {
	    // Attach a convenience function to send a JSON client error.
	    res.sendClientError = function (message) {
	      // eslint-disable-line no-param-reassign
	      return res.status(400).json({ error: message });
	    };
	
	    // Catch errors in the form of a rejected promise.
	    var promise = new Promise(function (resolve, reject) {
	      try {
	        resolve(fn(req, res));
	      } catch (e) {
	        reject(e);
	      }
	    });
	
	    // Ensure a response is sent.
	    promise.then(function (result) {
	      if (!res.headersSent) {
	        if (!result) {
	          result = {}; // Empty response => success!
	        }
	        return res.status(200).json(result);
	      }
	    }).catch(function (error) {
	      // eslint-disable-next-line no-console
	      console.error('Error in handler:\n', error);
	      if (!res.headersSent) {
	        return res.status(500).send({ error: 'Internal server error.' });
	      }
	    });
	  };
	
	  return wrapper;
	}; // Networking utilities.
	
	var fetchJson = exports.fetchJson = function fetchJson(url, options) {
	  return fetch(url, options).then(function (response) {
	    return response.json().then(function (json) {
	      if (!response.ok) {
	        throw Error(JSON.stringify(json));
	      }
	      return json;
	    });
	  });
	};

/***/ },
/* 13 */
/*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 14 */
/*!**************************************!*\
  !*** ./server/routes/permissions.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Permissions for third-party services.
	
	// We do this here instead of in scout-service because we cannot pass JWT to
	
	var _crypto = __webpack_require__(/*! crypto */ 16);
	
	var _crypto2 = _interopRequireDefault(_crypto);
	
	var _express = __webpack_require__(/*! express */ 2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _googleapis = __webpack_require__(/*! googleapis */ 7);
	
	var _googleapis2 = _interopRequireDefault(_googleapis);
	
	var _queryString = __webpack_require__(/*! query-string */ 17);
	
	var _queryString2 = _interopRequireDefault(_queryString);
	
	var _request = __webpack_require__(/*! request */ 19);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _googleAuth = __webpack_require__(/*! ../infra/google-auth */ 8);
	
	var googleAuth = _interopRequireWildcard(_googleAuth);
	
	var _net = __webpack_require__(/*! ../infra/net */ 12);
	
	var _settings = __webpack_require__(/*! ../../settings */ 10);
	
	var _settings2 = _interopRequireDefault(_settings);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var OAuth2 = _googleapis2.default.auth.OAuth2;
	
	// Permissions for third-party services.
	
	
	var router = _express2.default.Router();
	
	var setPermission = function setPermission(jwt, provider, providerInfo) {
	  var params = {
	    scoutWebServerSecret: _settings2.default.keys.scoutWebServerSecret,
	    provider: provider,
	    providerInfo: providerInfo
	  };
	  var options = {
	    method: 'PATCH',
	    body: JSON.stringify(params),
	    headers: {
	      'content-type': 'application/json',
	      authorization: 'Scout JWT ' + jwt
	    }
	  };
	  var url = _settings2.default.scoutServiceUrl + '/api/permissions/';
	  return (0, _net.fetchJson)(url, options).then(function () {
	    return {};
	  });
	};
	
	// Google permissions.
	
	
	var redirectPath = '/permissions/callback/google';
	var oauth2Client = new OAuth2(_settings2.default.keys.google_clientId, _settings2.default.keys.google_clientSecret, _settings2.default.serverUrl + redirectPath);
	var getTokensFromCode = googleAuth.getTokensFromCode(oauth2Client);
	
	router.get('/google', (0, _net.endpoint)(function (req, res) {
	  var _req$query = req.query,
	      destination = _req$query.destination,
	      providerInfo = _req$query.providerInfo;
	
	
	  req.session.destination = destination;
	  req.session.jwt = req.cookies.jwt;
	  req.session.savedState = _crypto2.default.randomBytes(20).toString('hex');
	
	  var scopes = JSON.parse(providerInfo).scopes;
	
	  var url = oauth2Client.generateAuthUrl({
	    access_type: 'offline',
	    prompt: 'consent',
	    scope: scopes,
	    state: req.session.savedState
	  });
	
	  return res.redirect(url);
	}));
	
	// Note: Does NOT require an auth header.
	router.get('/callback/google', (0, _net.endpoint)(function (req, res) {
	  var _req$query2 = req.query,
	      code = _req$query2.code,
	      error = _req$query2.error,
	      state = _req$query2.state;
	  var _req$session = req.session,
	      jwt = _req$session.jwt,
	      destination = _req$session.destination,
	      savedState = _req$session.savedState;
	
	  req.session = null;
	
	  var next = function next() {
	    return res.redirect(_settings2.default.clientServerUrl + destination);
	  };
	  if (error || savedState !== state) {
	    next();
	  }
	
	  var tokensPromise = getTokensFromCode(code);
	  var tokenInfoPromise = tokensPromise.then(function (tokens) {
	    return googleAuth.getTokenInfo(tokens.accessToken);
	  });
	  var promises = Promise.all([tokensPromise, tokenInfoPromise]);
	
	  var permissionPromise = promises.then(function (values) {
	    var _values = _slicedToArray(values, 2),
	        tokens = _values[0],
	        tokenInfo = _values[1];
	
	    var providerInfo = {
	      scopes: tokenInfo.scope.split(' '),
	      accessToken: tokens.accessToken,
	      refreshToken: tokens.refreshToken,
	      accessTokenExpiration: tokens.accessTokenExpiration
	    };
	    return setPermission(jwt, 'google', providerInfo);
	  });
	
	  return permissionPromise.then(next).catch(next);
	}));
	
	// Dropbox permissions.
	
	var dropboxRedirectUri = _settings2.default.serverUrl + '/permissions/callback/dropbox';
	router.get('/dropbox', (0, _net.endpoint)(function (req, res) {
	  var destination = req.query.destination;
	
	
	  req.session.destination = destination;
	  req.session.jwt = req.cookies.jwt;
	  req.session.savedState = _crypto2.default.randomBytes(20).toString('hex');
	
	  var params = {
	    client_id: _settings2.default.keys.dropbox_clientId,
	    redirect_uri: dropboxRedirectUri,
	    response_type: 'code',
	    state: req.session.savedState
	  };
	  var stringified = _queryString2.default.stringify(params);
	  var url = 'https://www.dropbox.com/oauth2/authorize?' + stringified;
	
	  return res.redirect(url);
	}));
	
	// Note: Does NOT require an auth header.
	router.get('/callback/dropbox', (0, _net.endpoint)(function (req, res) {
	  var _req$query3 = req.query,
	      code = _req$query3.code,
	      state = _req$query3.state,
	      error = _req$query3.error;
	  var _req$session2 = req.session,
	      jwt = _req$session2.jwt,
	      destination = _req$session2.destination,
	      savedState = _req$session2.savedState;
	
	  req.session = null;
	
	  var destinationUrl = _settings2.default.clientServerUrl + destination;
	  if (error || savedState !== state) {
	    res.redirect(destinationUrl);
	  }
	
	  var tokenPromise = new Promise(function (resolve, reject) {
	    _request2.default.post('https://api.dropbox.com/1/oauth2/token', {
	      form: {
	        code: code,
	        grant_type: 'authorization_code',
	        redirect_uri: dropboxRedirectUri
	      },
	      auth: {
	        user: _settings2.default.keys.dropbox_clientId,
	        pass: _settings2.default.keys.dropbox_clientSecret
	      }
	    }, function (reqError, response, body) {
	      if (reqError) {
	        reject(reqError);
	        return;
	      }
	      resolve(JSON.parse(body));
	    });
	  });
	
	  return tokenPromise.then(function (token) {
	    var providerInfo = {
	      accessToken: token.access_token,
	      accountId: token.account_id
	    };
	    return setPermission(jwt, 'dropbox', providerInfo);
	  }).then(function () {
	    return res.redirect(destinationUrl);
	  }).catch(function (err) {
	    return res.redirect(destinationUrl + '?error=' + err);
	  });
	}));
	
	exports.default = router;

/***/ },
/* 15 */,
/* 16 */
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 17 */
/*!*******************************!*\
  !*** external "query-string" ***!
  \*******************************/
/***/ function(module, exports) {

	module.exports = require("query-string");

/***/ },
/* 18 */,
/* 19 */
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = require("request");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map