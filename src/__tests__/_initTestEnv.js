/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

window.config = {
  ndlaApiUrl: 'http://ndla-api',
};

// Object.defineProperty(window, 'config', {
//   ndlaApiUrl: 'http://ndla-api',
// });

const localStorageMock = (function createLocalStorage() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
}());

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


localStorage.setItem('access_token', '123456789');
localStorage.setItem('id_token', '123456789');
// Use late exires at time to prevent it expiring when running tdd
localStorage.setItem('access_token_expires_at', new Date().getTime() + (24 * 60 * 1000));
localStorage.setItem('id_token_expires_at', new Date().getTime() + (24 * 60 * 1000));
