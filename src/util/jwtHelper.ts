/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { JwtPayload, jwtDecode as decode } from "jwt-decode";

interface NDLAToken extends JwtPayload {
  "https://ndla.no/ndla_id"?: string;
  "https://ndla.no/user_name"?: string;
  "https://ndla.no/user_email"?: string;
  scope?: string;
  permissions?: string[];
}

export const decodeToken = (accessToken: string | undefined | null): NDLAToken | null => {
  if (!accessToken) return null;
  try {
    return decode<NDLAToken>(accessToken);
  } catch (e) {
    return null;
  }
};
