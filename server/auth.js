/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-fetch';
import btoa from 'btoa';

const url = `https://ndla.eu.auth0.com/oauth/token`;
const editorialFrontendClientId = process.env.NDLA_EDITORIAL_CLIENT_ID;
const editorialFrontendClientSecret = process.env.NDLA_EDITORIAL_CLIENT_SECRET;

const b64EncodeUnicode = str =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(`0x${p1}`),
    ),
  );

export const getToken = () =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: `${editorialFrontendClientId}`,
      client_secret: `${editorialFrontendClientSecret}`,
      audience: 'ndla_system',
    }),
    json: true,
  }).then(res => res.json());

export const getBrightcoveToken = () => {
  const bightCoveUrl = 'https://oauth.brightcove.com/v3/access_token';
  const clientIdSecret = `${process.env.BRIGHTCOVE_API_CLIENT_ID}:${
    process.env.BRIGHTCOVE_API_CLIENT_SECRET
  }`;
  return fetch(bightCoveUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: `Basic ${b64EncodeUnicode(clientIdSecret)}`,
    },
    body: 'grant_type=client_credentials',
  }).then(res => res.json());
};
