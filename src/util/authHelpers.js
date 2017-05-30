/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';

export const AUTH0_DOMAIN = window.config.auth0Domain;
export const AUTH0_CLIENT_ID = window.config.auth0ClientID;

if (process.env.NODE_ENV === 'unittest') {
  global.__SERVER__ = false; //eslint-disable-line
}

const locationOrigin = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-frontend';
  }

  if (typeof location.origin === 'undefined') {
    location.origin = [location.protocol, '//', location.host, ':', location.port].join('');
  }

  return location.origin;
})();

export const auth0ClientId = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return '123456789';
  }
  return AUTH0_CLIENT_ID;
})();

export const auth0Domain = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://auth-ndla';
  }
  return AUTH0_DOMAIN;
})();


export function getToken(getState) {
  return getState().authenticated ? getState().idToken : getState().accessToken;
}

export { locationOrigin };


export function ApiError(message, res = {}, json) {
  this.name = 'ApiError';
  this.message = message;
  this.url = res.url;
  this.status = res.status;
  this.json = json;
  this.code = json.code;
  // Drop creating a stack for easier unit testing
  // The stack does'nt give any value as long as the ApiError is only created in createErrorPayload()
  // this.stack = (new Error()).stack;
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

export function createErrorPayload(res, message, json) {
  return new ApiError(`${res.status} ${message} ${json.code} ${json.description}`, res, json);
}

