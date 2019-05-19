const util = require('util');
const webpack = require('webpack');
const { appendWebpackPlugin } = require('@rescripts/utilities');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const logConfig = config => {
  console.log(util.inspect(config, null, 20, true));
  return config;
};

logConfig.isMiddleware = true;

const addWebpackPlugins = config => {
  config = appendWebpackPlugin(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      openAnalyzer: false,
    }),
    config,
  );
  config = appendWebpackPlugin(
    new LodashModuleReplacementPlugin({
      // shorthands: true,
      // cloning: true,

      // used by semantic-ui
      currying: true,
      collections: true,

      // caching: true,
      // exotics: true,
      // guards: true,
      // metadata: true,
      // deburring: true,
      // unicode: true,
      // chaining: true,
      // memoizing: true,
      // coercions: true,
      // flattening: true,
      // paths: true,
      // placeholders: true,
    }),
    config,
  );
  // config = appendWebpackPlugin(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), config);
  return config;
};

const addEntryPoints = config => {
  config.entry.unshift('url-search-params-polyfill');
  return config;
};

module.exports = [
  ['use-babel-config', '.babelrc.js'],
  addEntryPoints,
  addWebpackPlugins,
  // logConfig,
];
