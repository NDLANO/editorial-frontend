module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupTestFrameworkScriptFile: './src/__tests__/jest.setup.js',
  snapshotSerializers: ['jest-emotion/serializer'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
};
