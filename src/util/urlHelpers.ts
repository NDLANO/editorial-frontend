/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SUPPORTED_LANGUAGES } from "../constants";

const LANGUAGE_REGEXP = new RegExp(`^\\/(${SUPPORTED_LANGUAGES.join("|")})($|\\/)`, "");

export const constructNewPath = (pathname: string, newLocale?: string) => {
  const path = pathname.replace(LANGUAGE_REGEXP, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = newLocale ? `/${newLocale}` : "";
  return `${localePrefix}${fullPath}`;
};
