/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'cross-fetch';
import btoa from 'btoa';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getEnvironmentVariabel, getUniversalConfig, getZendeskWidgetSecret } from '../config';

const url = `https://${getUniversalConfig().auth0Domain}/oauth/token`;
const editorialFrontendClientId = getEnvironmentVariabel('NDLA_EDITORIAL_CLIENT_ID');
const editorialFrontendClientSecret = getEnvironmentVariabel('NDLA_EDITORIAL_CLIENT_SECRET');

const b64EncodeUnicode = (str: string) =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(Number(`0x${p1}`)),
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

type ManagementToken = { access_token: string };

export const getUsers = (managementToken: ManagementToken, userIds: string) => {
  const query = userIds
    .split(',')
    .map(userId => `"${userId}"`)
    .join(' OR ');
  return fetch(
    `https://${getUniversalConfig().auth0Domain}/api/v2/users?q=app_metadata.ndla_id:(${query})`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${managementToken.access_token}`,
      },
    },
  ).then(res => res.json());
};

async function fetchEditors(token: string, query: string, page: number) {
  return fetch(`https://${getUniversalConfig().auth0Domain}/api/v2/users?${query}&page=${page}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
}

export const getEditors = async (managementToken: ManagementToken, role: string) => {
  const query = `include_totals=true&q=app_metadata.roles:"${role}"`;

  const firstPage = await fetchEditors(managementToken.access_token, query, 0);
  const numberOfPages = Math.ceil(firstPage.total / firstPage.length);
  const requests = [firstPage];
  for (let i = 1; i < numberOfPages; i += 1) {
    requests.push(fetchEditors(managementToken.access_token, query, i));
  }
  const results = await Promise.all(requests);
  return results.reduce((acc, res) => [...acc, ...res.users], []);
};

export const getZendeskToken = (name: string, email: string): string => {
  const payload = {
    name: name,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),
  };
  return jwt.sign(payload, getZendeskWidgetSecret());
};
