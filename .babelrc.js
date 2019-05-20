// this file is used as is by create-react-app, no merging required
module.exports = {
  presets: ['react-app'],
  plugins: [
    [
      'transform-semantic-ui-react-imports',
      {
        convertMemberImports: true,
        importType: 'es',
        addCssImports: true,
        importMinifiedCssFiles: true,
        addLessImports: false,
        addDuplicateStyleImports: false,
      },
    ],
    'lodash',
  ],
};
