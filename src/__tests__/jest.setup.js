/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expectSaga } from 'redux-saga-test-plan';

global.DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT
  ? parseInt(process.env.DEFAULT_TIMEOUT, 10)
  : 100;

jest.setTimeout = process.env.JEST_TIMEOUT
  ? parseInt(process.env.JEST_TIMEOUT, 10)
  : 30000;

/* eslint-disable */
/* https://github.com/facebook/jest/issues/3788 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = process.env.JEST_TIMEOUT
  ? parseInt(process.env.JEST_TIMEOUT, 10)
  : 30000;

expectSaga.DEFAULT_TIMEOUT = global.DEFAULT_TIMEOUT;

// fix: `matchMedia` not present, legacy browsers require a polyfill
global.matchMedia =
  global.matchMedia ||
  function() {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
