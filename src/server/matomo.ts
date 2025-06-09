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

export const fetchMatomoStats = async (urls: string[]) => {
  const fetchPromises = urls.map((url) => {
    const withLang = [`/nb${url}`, `/nn${url}`, `/en${url}`, `/se${url}`, url];
    const bulkRequest = withLang.map(
      (url, index) =>
        `urls[${index}]=${encodeURIComponent(`method=Actions.getPageUrl&idSite=${config.matomoSiteId}&pageUrl=${url}&period=month&date=previous12&showColumns=nb_visits,nb_hits,avg_time_on_page`)}`,
    );
    return limit(() =>
      fetch(
        `https://${config.matomoUrl}/index.php?module=API&method=API.getBulkRequest&format=JSON&token_auth=${matomoApiToken}&${bulkRequest.join("&")}`,
      ).then((res) => res.json()),
    );
  });

  const results = await Promise.allSettled(fetchPromises);
  return results;
};
