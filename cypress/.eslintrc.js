module.exports = {
    extends: '../.eslintrc.js',
    plugins: [
      'cypress',
    ]
    env: {
      'cypress/globals': true,
    }
    rules: {
      'no-unused-expressions': 0,
    },
    globals: {
      cy: true,
      Cypress: true,
    },
  };