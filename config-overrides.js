const { injectBabelPlugin } = require('react-app-rewired');

const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer');
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
  }

  console.log(inspect(config, null, 20));
  console.log(inspect(env, null, 20));
  return config;
};
