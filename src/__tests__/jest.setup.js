jest.setTimeout = process.env.JEST_TIMEOUT
  ? parseInt(process.env.JEST_TIMEOUT, 10)
  : 30000;
