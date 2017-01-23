# scout-web

A web client for Scout. Currently just supports setting permissions. The server is a very thin layer that handles OAuth redirects. All other backend-y tasks should be handled by `scout-service`, authenticated via JWT in header.

## Setup

The during development the client code is served by the [react-scripts](https://github.com/facebookincubator/create-react-app) server on [http://localhost:3000](http://localhost:3000) for hot module reloading. The server code is run by nodemon on `3001`. In production the client code is bundled and served by the server code.

If you're doing just client development, run the following:

```
npm run start-dev
```

This will start both the react-scripts server and our server. When you edit client code the page should automatically refresh. If you're doing server development and want to more closely monitor the server use:

```
npm run client
npm run server-dev
```
