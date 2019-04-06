const { injectBabelPlugin } = require('react-app-rewired');

const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const DeadCodePlugin = require('webpack-deadcode-plugin');

module.exports = function override(config, env) {
  const isProd = env === 'production';
  //do stuff with the webpack config...
  config = rewireStyledComponents(config, env);
  // config = rewireLodash(config, env, {
  //   id: ['lodash', 'semantic-ui-react'],
  // });
  config = injectBabelPlugin(
    [
      'semantic-ui-react-transform-imports',
      {
        convertMemberImports: true,
        importType: 'es',
        addCssImports: false,
      },
    ],
    config,
  );

  config.entry.unshift('@babel/polyfill');
  config.entry.unshift('url-search-params-polyfill');

  if (!isProd) {
    config = rewireWebpackBundleAnalyzer(config, env, {
      analyzerMode: 'static',
      reportFilename: 'report.html',
    });

    config.plugins.push(
      new DuplicatePackageCheckerPlugin(),
      new DeadCodePlugin({
        patterns: ['src/**/*.(js|jsx|css)'],
        exclude: ['**/*.(stories|spec).(js|jsx)'],
      }),
    );
  }

  return config;
};
