/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import btoa from 'btoa';
import { getEnvironmentVariabel, getUniversalConfig } from '../config';

const url = `https://${getUniversalConfig().auth0Domain}/oauth/token`;
const editorialFrontendClientId = getEnvironmentVariabel(
  'NDLA_EDITORIAL_CLIENT_ID',
);
const editorialFrontendClientSecret = getEnvironmentVariabel(
  'NDLA_EDITORIAL_CLIENT_SECRET',
);

const b64EncodeUnicode = str =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(`0x${p1}`),
    ),
  );

export const getToken = (audience = 'ndla_system') =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: `${editorialFrontendClientId}`,
      client_secret: `${editorialFrontendClientSecret}`,
      audience,
    }),
    json: true,
  }).then(res => res.json());

export const getBrightcoveToken = () => {
  const bightCoveUrl = 'https://oauth.brightcove.com/v3/access_token';
  const clientIdSecret = `${getEnvironmentVariabel(
    'BRIGHTCOVE_API_CLIENT_ID',
  )}:${getEnvironmentVariabel('BRIGHTCOVE_API_CLIENT_SECRET')}`;
  return fetch(bightCoveUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: `Basic ${b64EncodeUnicode(clientIdSecret)}`,
    },
    body: 'grant_type=client_credentials',
  }).then(res => res.json());
};

export const getUsers = (managementToken, userIds) => {
  const query = userIds
    .split(',')
    .map(userId => `app_metadata.ndla_id:"${userId}"`)
    .join(' OR ');
  return fetch(
    `https://${getUniversalConfig().auth0Domain}/api/v2/users?q=${query}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${managementToken.access_token}`,
      },
      json: true,
    },
  ).then(res => res.json());
};

export const getEditors = managementToken => {
  return fetch(
    `https://${
      getUniversalConfig().auth0Domain
    }/api/v2/users?q=app_metadata.roles:"drafts:write"`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${managementToken.access_token}`,
      },
      json: true,
    },
  ).then(res => res.json());
};
