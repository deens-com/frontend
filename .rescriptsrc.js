const util = require('util');
const { appendWebpackPlugin } = require('@rescripts/utilities');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const logConfig = config => {
  console.log(util.inspect(config, null, 20, true));
  return config;
};

logConfig.isMiddleware = true;

const addWebpackBundleAnalyzer = config => {
  return appendWebpackPlugin(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      openAnalyzer: false,
    }),
    config,
  );
};

const addEntryPoints = config => {
  config.entry.unshift('url-search-params-polyfill');
  return config;
};

module.exports = [
  ['use-babel-config', '.babelrc.js'],
  addEntryPoints,
  addWebpackBundleAnalyzer,
  logConfig,
];
