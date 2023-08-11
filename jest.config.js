module.exports = {
  testMatch: ['**/__tests__/*-test.(js|jsx|ts|tsx)'],
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.js'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest/presets/js-with-babel',
};
