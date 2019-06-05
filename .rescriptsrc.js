const util = require('util');
const webpack = require('webpack');
const path = require('path');
const { appendWebpackPlugin } = require('@rescripts/utilities');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackModules = require('webpack-modules');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

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
      placeholders: true, // breaks some Modals
      coercions: true, // breaks some Modals
      cloning: true, // some location selectors work weird without this (check trip premium quote)
      //flattening: true,
      //caching: true,
      //exotics: true,
      //guards: true,
      //metadata: true,
      //deburring: true,
      //memoizing: true,
      //paths: true,
      //unicode: true,
      //chaining: true,
    }),
    config,
  );
  // config = appendWebpackPlugin(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), config);
  config = appendWebpackPlugin(new WebpackModules(), config);
  config = appendWebpackPlugin(
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      },
    }),
    config,
  );
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

const nameChunks = config => {
  config.output.filename = '[name].[hash].js';
  config.output.chunkFilename = '[name].[chunkhash].js';
  config.output.path = path.resolve(__dirname, 'build');
  return config;
};

module.exports = [
  ['use-babel-config', '.babelrc.js'],
  addEntryPoints,
  addWebpackPlugins,
  nameChunks,
  moveHeavyLibsIntoSeparateChunks,
  // useDayJsInsteadOfMoment, // (react-dates crashes with it)
  // logConfig,
];
