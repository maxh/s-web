var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var KEYS_DIR = path.resolve(__dirname, 'keys');
var SRC_DIR = path.resolve(__dirname, 'server');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server/index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include : SRC_DIR,
        loader: ['babel-loader'],
        query: {
          cacheDirectory: 'babel_cache/server',
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include : KEYS_DIR,
      }
    ]
  },
  externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ],
  devtool: 'sourcemap'
}
