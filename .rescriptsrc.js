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
      // cloning: true,

      // used by semantic-ui
      shorthands: true, // breaks Form.Dropdown
      currying: true, // breaks everything
      collections: true, // breaks Login

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

const useDayJsInsteadOfMoment = config => {
  config.resolve.alias['moment'] = 'dayjs/esm';
  return config;
};

const moveHeavyLibsIntoSeparateChunks = config => {
  config.optimization.splitChunks = {
    ...config.optimization.splitChunks,
    maxAsyncRequests: 20,
    minSize: 100000,
  };
  return config;
};

module.exports = [
  ['use-babel-config', '.babelrc.js'],
  addEntryPoints,
  addWebpackPlugins,
  moveHeavyLibsIntoSeparateChunks,
  // useDayJsInsteadOfMoment, // (react-dates crashes with it)
  // logConfig,
];
