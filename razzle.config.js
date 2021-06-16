const { modifyRule } = require('razzle-config-utils');
const LoadablePlugin = require('@loadable/webpack-plugin');

module.exports = {
  modifyWebpackConfig({ env: { target, dev }, webpackConfig: appConfig }) {
    modifyRule(appConfig, { test: /\.css$/ }, rule => {
      rule.use.push({ loader: 'postcss-loader' });
    });

    const addEntry = options => {
      if (target === 'web') {
        if (dev) {
          appConfig.entry[options.name] = [
            options.disableHMR ? undefined : appConfig.entry.client[0], // hot reloading
            options.entry,
          ].filter(entry => entry !== undefined);
        } else {
          appConfig.entry[options.name] = [options.entry];
        }
      }
    };

    addEntry({
      entry: 'monaco-editor/esm/vs/editor/editor.worker.js',
      name: 'editor.worker',
      disableHMR: true,
    });
    addEntry({
      entry: 'monaco-editor/esm/vs/language/html/html.worker.js',
      name: 'html.worker',
      disableHMR: true,
    });

    if (target === 'web') {
      appConfig.plugins = [
        ...appConfig.plugins,
        new LoadablePlugin({ filename: 'loadable-stats.json', writeToDisk: true }),
      ];

      appConfig.output.filename = dev ? 'static/js/[name].js' : 'static/js/[name].[hash:8].js';

      appConfig.output.globalObject = 'this'; // use this as global object to prevent webworker window error

      if (!dev) {
        appConfig.optimization.concatenateModules = true;
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
      process.env.CI = 'false';
    }

    return appConfig;
  },
};
