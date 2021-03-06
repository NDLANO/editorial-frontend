/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './raf-polyfill';

/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import prettier from 'prettier/standalone';
import parseHTML from 'prettier/parser-html';

/* eslint-enable */
configure({ adapter: new Adapter() });

const localStorageMock = (function createLocalStorage() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

const prettify = content =>
  prettier.format(`${content}`, {
    parser: 'html',
    plugins: [parseHTML],
  });
global.prettifyHTML = prettify;

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

localStorage.setItem('access_token', '123456789');
localStorage.setItem('access_token_expires_at', new Date().getTime() + 24 * 60 * 60 * 1000);
