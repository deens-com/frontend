const { injectBabelPlugin } = require('react-app-rewired');
const webpack = require('webpack');

const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer');
const rewirePreloadPlugin = require('react-app-rewire-preload-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
// const rewireLodash = require('react-app-rewire-lodash');
const { inspect } = require('util');

module.exports = function override(config, env) {
  const isProd = env === 'production';
  //do stuff with the webpack config...
  config = rewireStyledComponents(config, env);
  // config = rewireLodash(config, env, {
  //   id: ['lodash', 'semantic-ui-react'],
  // });
  config = injectBabelPlugin(
    [
      'transform-semantic-ui-react-imports',
      {
        convertMemberImports: true,
        importType: 'es',
        addCssImports: false,
      },
    ],
    config
  );

  if (isProd) {
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: 'static',
      reportFilename: 'report.html',
    });
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({ resource }) => /node_modules/.test(resource),
      }),
      new DuplicatePackageCheckerPlugin()
    );
    // Add preloading support
    config = rewirePreloadPlugin(config, env, { rel: 'prefetch' });
  }

  return config;
};
