require("source-map-support").install(),function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={exports:{},id:o,loaded:!1};return e[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var n=r(10),s=o(n),i=r(3),u=o(i),c=r(11),a=o(c),l=r(12),f=o(l),d=r(15),p=o(d),v=r(7),h=o(v),g=r(8),y=o(g),k=r(2),_=o(k),b=(0,u.default)();b.use((0,a.default)()),b.use((0,f.default)({secret:_.default.keys.scoutWebSessionKey})),_.default.isDev||b.use(u.default.static("client/build"));var S=function(e,t,r){return!_.default.isDev&&_.default.isHeroku&&"https"!==e.header("x-forwarded-proto")?t.redirect("https://"+e.header("host")+e.url):r()};b.use(S),b.use(s.default.json()),b.use((0,p.default)("combined")),b.use("/auth",h.default),b.use("/permissions",y.default),b.listen(_.default.port,function(){console.log("Server listening on: ",_.default.port)})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetchJson=t.endpoint=void 0,r(14);t.endpoint=function(e){var t=function(t,r){r.sendClientError=function(e){return r.status(400).json({error:e})};var o=new Promise(function(o,n){try{o(e(t,r))}catch(e){n(e)}});o.then(function(e){if(!r.headersSent)return e||(e={}),r.status(200).json(e)}).catch(function(e){if(console.error("Error in handler:\n",e),!r.headersSent)return r.status(500).send({error:"Internal server error."})})};return t},t.fetchJson=function(e,t){return fetch(e,t).then(function(e){return e.json().then(function(t){if(!e.ok)throw Error(JSON.stringify(t));return t})})}},function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(5),s=o(n);process.env.AUTH_KEYS?s.default.keys=JSON.parse(process.env.AUTH_KEYS):s.default.keys=r(9),t.default=s.default},function(e,t){e.exports=require("express")},function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.getProfile=t.getTokenInfo=t.getTokensFromCode=void 0;var n=r(2),s=o(n),i=r(1);t.getTokensFromCode=function(e){return function(t){return new Promise(function(r,o){e.getToken(t,function(e,t){return e?void o(e):void r({refreshToken:t.refresh_token,accessToken:t.access_token,accessTokenExpiration:t.expiry_date/1e3})})})}},t.getTokenInfo=function(e){var t="https://www.googleapis.com/oauth2/v3/tokeninfo",r=t+"?access_token="+e;return(0,i.fetchJson)(r)},t.getProfile=function(e){var t="https://www.googleapis.com/plus/v1/people/me";return t+="?access_token="+e,t+="&key="+s.default.keys.google_apiKey,(0,i.fetchJson)(t)}},function(e,t){const r={};r.isDev=!("production"===process.env.NODE_ENV||"staging"===process.env.NODE_ENV),r.isHeroku=process.env.PORT,r.isDev?(r.port=3001,r.serverUrl="http://localhost:"+r.port,r.clientServerUrl="http://localhost:3000",r.scoutServiceUrl="http://localhost:5000"):(r.isHeroku?(r.port=process.env.PORT,r.serverUrl="https://"+process.env.HOSTNAME,r.scoutServiceUrl="https://scout-service.herokuapp.com"):(r.port=3001,r.serverUrl="http://localhost:3001",r.scoutServiceUrl="http://localhost:5000"),r.clientServerUrl=r.serverUrl),e.exports=r},function(e,t){e.exports=require("googleapis")},function(e,t,r){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){var r=[],o=!0,n=!1,s=void 0;try{for(var i,u=e[Symbol.iterator]();!(o=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);o=!0);}catch(e){n=!0,s=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw s}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=r(3),u=n(i),c=r(6),a=n(c),l=r(4),f=o(l),d=r(1),p=r(2),v=n(p),h=a.default.auth.OAuth2,g="/auth/callback",y=new h(v.default.keys.google_clientId,v.default.keys.google_clientSecret,v.default.serverUrl+g),k=f.getTokensFromCode(y),_=["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email"],b="No refresh token!",S=function(e){var t=v.default.scoutServiceUrl+"/auth/jwt/fromtokens";e.scoutWebServerSecret=v.default.keys.scoutWebServerSecret;var r={method:"POST",body:JSON.stringify(e),headers:{"content-type":"application/json"}};return fetch(t,r,!1).then(function(e){return e.json().then(function(t){if(!e.ok)throw Error(t.error);return t.jwt})})},m=u.default.Router();m.get("/sign-in",(0,d.endpoint)(function(e,t){var r=e.query.destination;e.session.destination=r;var o=y.generateAuthUrl({access_type:"offline",scope:_});return t.redirect(o)})),m.get("/callback",(0,d.endpoint)(function(e,t){var r=e.query.code,o=e.session.destination,n=k(r),i=n.then(function(e){return f.getTokenInfo(e.accessToken)}).then(function(e){return e.scope.split(" ")}),u=n.then(function(e){return f.getProfile(e.accessToken)}),c=Promise.all([n,i,u]),a=c.then(function(e){var t=s(e,3),r=t[0],o=t[1],n=t[2],i={googleId:n.id,email:n.emails[0].value,name:n.displayName,scopes:o,tokens:r};return S(i)});return a.then(function(e){t.session=null,t.cookie("jwt",e),t.redirect(v.default.clientServerUrl+o)}).catch(function(e){if(e.message===b){var r=y.generateAuthUrl({access_type:"offline",prompt:"consent",scope:_});t.redirect(r)}console.error("Error signing in: ",e)})})),t.default=m},function(e,t,r){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){var r=[],o=!0,n=!1,s=void 0;try{for(var i,u=e[Symbol.iterator]();!(o=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);o=!0);}catch(e){n=!0,s=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw s}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=r(13),u=n(i),c=r(3),a=n(c),l=r(6),f=n(l),d=r(16),p=n(d),v=r(17),h=n(v),g=r(4),y=o(g),k=r(1),_=r(5),b=n(_),S=f.default.auth.OAuth2,m=a.default.Router(),w=function(e,t,r){var o={scoutWebServerSecret:b.default.keys.scoutWebServerSecret,provider:t,providerInfo:r},n={method:"PATCH",body:JSON.stringify(o),headers:{"content-type":"application/json",authorization:"Scout JWT "+e}},s=b.default.scoutServiceUrl+"/api/permissions/";return(0,k.fetchJson)(s,n).then(function(){return{}})},x="/permissions/callback/google",T=new S(b.default.keys.google_clientId,b.default.keys.google_clientSecret,b.default.serverUrl+x),j=y.getTokensFromCode(T);m.get("/google",(0,k.endpoint)(function(e,t){var r=e.query,o=r.destination,n=r.providerInfo;e.session.destination=o,e.session.jwt=e.cookies.jwt,e.session.savedState=u.default.randomBytes(20).toString("hex");var s=JSON.parse(n).scopes,i=T.generateAuthUrl({access_type:"offline",prompt:"consent",scope:s,state:e.session.savedState});return t.redirect(i)})),m.get("/callback/google",(0,k.endpoint)(function(e,t){var r=e.query,o=r.code,n=r.error,i=r.state,u=e.session,c=u.jwt,a=u.destination,l=u.savedState;e.session=null;var f=function(){return t.redirect(b.default.clientServerUrl+a)};(n||l!==i)&&f();var d=j(o),p=d.then(function(e){return y.getTokenInfo(e.accessToken)}),v=Promise.all([d,p]),h=v.then(function(e){var t=s(e,2),r=t[0],o=t[1],n={scopes:o.scope.split(" "),accessToken:r.accessToken,refreshToken:r.refreshToken,accessTokenExpiration:r.accessTokenExpiration};return w(c,"google",n)});return h.then(f).catch(f)}));var O=b.default.serverUrl+"/permissions/callback/dropbox";m.get("/dropbox",(0,k.endpoint)(function(e,t){var r=e.query.destination;e.session.destination=r,e.session.jwt=e.cookies.jwt,e.session.savedState=u.default.randomBytes(20).toString("hex");var o={client_id:b.default.keys.dropbox_clientId,redirect_uri:O,response_type:"code",state:e.session.savedState},n=p.default.stringify(o),s="https://www.dropbox.com/oauth2/authorize?"+n;return t.redirect(s)})),m.get("/callback/dropbox",(0,k.endpoint)(function(e,t){var r=e.query,o=r.code,n=r.state,s=r.error,i=e.session,u=i.jwt,c=i.destination,a=i.savedState;e.session=null;var l=b.default.clientServerUrl+c;(s||a!==n)&&t.redirect(l);var f=new Promise(function(e,t){h.default.post("https://api.dropbox.com/1/oauth2/token",{form:{code:o,grant_type:"authorization_code",redirect_uri:O},auth:{user:b.default.keys.dropbox_clientId,pass:b.default.keys.dropbox_clientSecret}},function(r,o,n){return r?void t(r):void e(JSON.parse(n))})});return f.then(function(e){var t={accessToken:e.access_token,accountId:e.account_id};return w(u,"dropbox",t)}).then(function(){return t.redirect(l)}).catch(function(e){return t.redirect(l+"?error="+e)})})),t.default=m},function(e,t){e.exports={dark_sky:"61ae0da07a6ba575cf52b3a183bbcbbd",gmaps:"AIzaSyCaXnRt4J82cRuseQR98IngQJRyMJCPnWw",nyt:"3060d0e08cb9494f8ff10db9461552f6",google_clientId:"447160699625-cuvgvmtcfpl1c1jehq9dntcd1sgomi3g.apps.googleusercontent.com",google_clientSecret:"1dhLvo_grF0yCM_XVM8OyogN",google_apiKey:"AIzaSyCaXnRt4J82cRuseQR98IngQJRyMJCPnWw",dropbox_clientId:"dg3od5r6l2xuy1a",dropbox_clientSecret:"1at9hla0qjies73",jwtSecret:"cNWBAsajXfBhbFZ0sQsGfQVkIlzslJh5WEmOEDOts421O7AvEsVfyVuihTb",scoutWebServerSecret:"sSkCNyf93qA5ZNG9GHbBDFTMLrWx9DMjRodCN9oFb90hicys06zj8lmxbbvA",scoutWebSessionKey:"CtBjTxYgz6cMCeaMXNYFrfGa5WTcQwgNs7C0T2JYEzcURmzXuwMXUc1e8IRptHkBKDHTR0rTvllNBxhP"}},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("cookie-parser")},function(e,t){e.exports=require("cookie-session")},function(e,t){e.exports=require("crypto")},function(e,t){e.exports=require("isomorphic-fetch")},function(e,t){e.exports=require("morgan")},function(e,t){e.exports=require("query-string")},function(e,t){e.exports=require("request")}]);
//# sourceMappingURL=server.js.map