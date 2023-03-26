/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

global.DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT
  ? parseInt(process.env.DEFAULT_TIMEOUT, 10)
  : 100;

const jestTimeout = process.env.JEST_TIMEOUT ? parseInt(process.env.JEST_TIMEOUT, 10) : 30000;

jest.setTimeout(jestTimeout);

/* eslint-disable */
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
