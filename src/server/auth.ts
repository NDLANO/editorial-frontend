/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEnvironmentVariabel, getUniversalConfig } from "../config";
import { Auth0UserData } from "../interfaces";

const url = `https://${getUniversalConfig().auth0Domain}/oauth/token`;
const editorialFrontendClientId = getEnvironmentVariabel("NDLA_EDITORIAL_CLIENT_ID");
const editorialFrontendClientSecret = getEnvironmentVariabel("NDLA_EDITORIAL_CLIENT_SECRET");

const btoa = (str: string) => Buffer.from(str.toString(), "binary").toString("base64");

const b64EncodeUnicode = (str: string) =>
  btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => String.fromCharCode(Number(`0x${p1}`))));

export const getToken = (audience = "ndla_system") =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: `${editorialFrontendClientId}`,
      client_secret: `${editorialFrontendClientSecret}`,
      audience,
    }),
  }).then((res) => res.json());

export const getBrightcoveToken = () => {
  const bightCoveUrl = "https://oauth.brightcove.com/v3/access_token";
  const clientIdSecret = `${getEnvironmentVariabel("BRIGHTCOVE_API_CLIENT_ID")}:${getEnvironmentVariabel(
    "BRIGHTCOVE_API_CLIENT_SECRET",
  )}`;
  return fetch(bightCoveUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      Authorization: `Basic ${b64EncodeUnicode(clientIdSecret)}`,
    },
    body: "grant_type=client_credentials",
  }).then((res) => res.json());
};

const mapToUserData = (users: Auth0UserProfile[]): Auth0UserData[] =>
  users.map(({ name, app_metadata: { ndla_id } }) => ({
    name,
    app_metadata: {
      ndla_id,
    },
  }));

type ManagementToken = { access_token: string };

export const fetchAuth0UsersById = async (
  managementToken: ManagementToken,
  userIds: string,
): Promise<Auth0UserData[]> => {
  const query = userIds
    .split(",")
    .map((userId) => `"${userId}"`)
    .join(" OR ");
  const res = await fetch(
    `https://${getUniversalConfig().auth0Domain}/api/v2/users?q=app_metadata.ndla_id:(${query})`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${managementToken.access_token}`,
      },
    },
  );
  const json = await res.json();
  return mapToUserData(json);
};

interface Auth0UserProfile {
  name: string;
  app_metadata?: any;
}

type PaginatedAuth0UserProfiles = {
  length: number;
  total: number;
  users: Auth0UserProfile[];
};

const fetchAuth0UsersByQuery = (token: string, query: string, page: number): Promise<PaginatedAuth0UserProfiles> =>
  fetch(`https://${getUniversalConfig().auth0Domain}/api/v2/users?${query}&include_totals=true&page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

const getUsersByQuery = async (token: string, query: string): Promise<Auth0UserData[]> => {
  const firstPage = await fetchAuth0UsersByQuery(token, query, 0);
  const numberOfPages = Math.ceil(firstPage.total / firstPage.length);
  const requests = [Promise.resolve(firstPage)];
  for (let i = 1; i < numberOfPages; i += 1) {
    requests.push(fetchAuth0UsersByQuery(token, query, i));
  }
  const results = await Promise.all(requests);
  return results.flatMap((res) => mapToUserData(res.users));
};

export const getEditors = (managementToken: ManagementToken): Promise<Auth0UserData[]> => {
  const query = `q=app_metadata.isOrWasEdUser:true&sort=name:1`;
  return getUsersByQuery(managementToken.access_token, query);
};

export const getResponsibles = (managementToken: ManagementToken, permission: string): Promise<Auth0UserData[]> => {
  const query = `q=app_metadata.permissions:"${permission}"&sort=name:1`;
  return getUsersByQuery(managementToken.access_token, query);
};
