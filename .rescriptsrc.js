const util = require('util');
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
      currying: true,
    }),
    config,
  );
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
