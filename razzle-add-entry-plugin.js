module.exports = options => (config, env, webpack) => {
  const appConfig = config;
  const { target, dev } = env;

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

  return appConfig;
};
