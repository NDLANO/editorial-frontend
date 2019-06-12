const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const addEntry = require('./razzle-add-entry-plugin');

module.exports = {
  plugins: [
    addEntry({
      entry: 'monaco-editor/esm/vs/editor/editor.worker.js',
      name: 'editor.worker',
      disableHMR: true,
    }),
    addEntry({
      entry: 'monaco-editor/esm/vs/language/html/html.worker.js',
      name: 'html.worker',
      disableHMR: true,
    }),
  ],
  modify(config, { target, dev }) {
    const appConfig = config;

    modifyRule(appConfig, { test: /\.css$/ }, rule => {
      rule.use.push({ loader: 'postcss-loader' });
    });

    if (target === 'web') {
      appConfig.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[hash:8].js';

      appConfig.output.globalObject = 'this'; // use this as global object to prevent webworker window error

      if (!dev) {
        appConfig.plugins.push(
          new webpack.optimize.ModuleConcatenationPlugin(),
        );
        appConfig.devtool = 'source-map';
        appConfig.performance = { hints: false };
      }
    }

    if (target === 'node' && !dev) {
      // This change bundles node_modules into server.js. The result is smaller Docker images.
      // It triggers a couple of «Critical dependency: the request of a dependency is an
      // expression warning» which we can safely ignore.
      appConfig.externals = [];
      // Razzle/CRA breaks the build on webpack warnings. Disable CI env to circumvent the check.
      process.env.CI = false;
    }

    return appConfig;
  },
};
