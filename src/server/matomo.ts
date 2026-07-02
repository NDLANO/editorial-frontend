/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LRUCache } from "lru-cache";
import pLimit from "p-limit";
import config, { getEnvironmentVariabel } from "../config";
import type { MatomoResponse } from "../modules/matomo/matomoApi";

const limit = pLimit(8);

const MATOMO_CACHE_MAX = 5000;
const MATOMO_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MATOMO_FETCH_TIMEOUT_MS = 10_000;

export const matomoApiToken = getEnvironmentVariabel("MATOMO_API_TOKEN");

const buildBulkRequestUrl = (url: string) => {
  const withLang = [`/nb${url}`, `/nn${url}`, `/en${url}`, `/se${url}`, url];
  const bulkRequest = withLang.map(
    (langUrl, index) =>
      `urls[${index}]=${encodeURIComponent(`method=Actions.getPageUrl&idSite=${config.matomoSiteId}&pageUrl=${langUrl}&period=month&date=last12&showColumns=nb_visits,nb_hits,avg_time_on_page`)}`,
  );
  return `https://${config.matomoUrl}/index.php?module=API&method=API.getBulkRequest&format=JSON&token_auth=${matomoApiToken}&${bulkRequest.join("&")}`;
};

const statsCache = new LRUCache<string, MatomoResponse>({
  max: MATOMO_CACHE_MAX,
  ttl: MATOMO_CACHE_TTL_MS,
  fetchMethod: (url) =>
    limit(async () => {
      const res = await fetch(buildBulkRequestUrl(url), { signal: AbortSignal.timeout(MATOMO_FETCH_TIMEOUT_MS) });
      return (await res.json()) as MatomoResponse;
    }),
});

export const fetchMatomoStats = async (urls: string[]) => {
  const fetchPromises = urls.map((url) => statsCache.fetch(url));
  return Promise.allSettled(fetchPromises);
};
