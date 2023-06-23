// workaround to make component selectors work with babel and jest.
module.exports = require('babel-jest').createTransformer({
  presets: [['razzle', { runtime: 'automatic', importSource: '@emotion/react' }]],
  plugins: ['@emotion'],
});
