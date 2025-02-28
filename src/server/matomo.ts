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

export const fetchMatomoStats = async (contextIds: string[]) => {
  const fetchPromises = contextIds.map((url) =>
    limit(() =>
      fetch(
        `https://${config.matomoUrl}/index.php?module=API&method=Actions.getPageUrls&idSite=${config.matomoSiteId}&period=year&date=last1&flat=1&filter_pattern=${encodeURIComponent(`${url}$`)}&format=JSON&token_auth=${matomoApiToken}`,
      ).then((res) => res.json()),
    ),
  );

  const results = await Promise.allSettled(fetchPromises);
  return results;
};
