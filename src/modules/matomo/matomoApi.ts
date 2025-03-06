/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";

export interface MatomoPageData {
  Actions_PageUrl: string;
  label: string;
  nb_visits: number;
  nb_hits: number;
  avg_time_on_page: number;
  segment: string;
  url: string;
}

export type MatomoResponse = Record<string, MatomoPageData[]>;

export interface MatomoStatsBody {
  contextIds: string[];
}

interface Props extends MatomoStatsBody {
  signal: AbortSignal;
}

export const fetchMatomoStats = async ({
  contextIds,
  signal,
}: Props): Promise<PromiseSettledResult<MatomoResponse>[]> => {
  return fetchAuthorized("/matomo-stats/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contextIds: contextIds }),
    signal: signal,
  }).then((r) => resolveJsonOrRejectWithError<PromiseSettledResult<MatomoResponse>[]>(r));
};
