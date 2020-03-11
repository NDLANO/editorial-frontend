module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx|ts|tsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupTestFrameworkScriptFile: './src/__tests__/jest.setup.js',
  snapshotSerializers: ['jest-emotion/serializer'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    // Use ts-jest for typescript tests: https://kulshekhar.github.io/ts-jest/user/babel7-or-ts#no-type-checking
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  },
};
