/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config, { getEnvironmentVariabel } from "../config";
import pLimit from "p-limit";

const limit = pLimit(8);

export const matomoApiToken = getEnvironmentVariabel("MATOMO_API_TOKEN");

export const fetchMatomoStats = async (taxonomyUrls: string[]) => {
  const MATOMO_URL = "tall.ndla.no";
  const siteId = config.matomoSiteId;

  const fetchPromises = taxonomyUrls.map((url) =>
    limit(() =>
      fetch(
        `https://${MATOMO_URL}/index.php?module=API&method=Actions.getPageUrl&idSite=${siteId}&period=year&date=last1&pageUrl=${encodeURIComponent(url)}&format=JSON&token_auth=${matomoApiToken}`,
      ).then((res) => res.json()),
    ),
  );

  const results = await Promise.allSettled(fetchPromises);
  return results;
};
