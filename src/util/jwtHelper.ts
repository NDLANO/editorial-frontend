/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import decode, { JwtPayload } from 'jwt-decode';

interface NDLAToken extends JwtPayload {
  'https://ndla.no/ndla_id'?: string;
  'https://ndla.no/user_name'?: string;
  'https://ndla.no/user_email'?: string;
  scope?: string[];
}

export function expiresIn(token: string): number {
  const decoded = decode<JwtPayload>(token);
  if (!(decoded.exp && decoded.iat)) return 0;
  return decoded.exp - decoded.iat - 60; // Add 60 second buffer
}

export function ndlaId(token?: string | null) {
  if (!token) return null;
  const decoded = decode<NDLAToken>(token);
  return decoded['https://ndla.no/ndla_id'];
}

export function ndlaUserName(token?: string | null) {
  if (!token) return null;
  const decoded = decode<NDLAToken>(token);
  return decoded['https://ndla.no/user_name'];
}

export function ndlaUserEmail(token?: string | null) {
  if (!token) return null;
  const decoded = decode<NDLAToken>(token);
  return decoded['https://ndla.no/user_email'];
}

export const decodeToken = (accessToken: string | null): NDLAToken | null => {
  if (!accessToken) return null;
  return decode<NDLAToken>(accessToken);
};

export const isValid = (accessToken: string | null) => {
  if (!accessToken) return false;
  try {
    decode<NDLAToken>(accessToken);
    return true;
  } catch (e) {
    return false;
  }
};
