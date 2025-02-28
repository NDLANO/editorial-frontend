/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchAuthorized, resolveJsonOrRejectWithError } from "../../util/apiHelpers";

export interface MatomoGoal {
  nb_conversions: number;
  nb_conv_pages_before: number;
  nb_conversions_attrib: number;
  nb_conversions_page_rate: number;
  nb_conversions_page_uniq: number;
  nb_conversions_entry_rate?: number;
  nb_conversions_entry?: number;
}

export interface MatomoPageData {
  label: string;
  nb_visits: number;
  nb_hits: number;
  sum_time_spent: number;
  sum_bandwidth: number;
  nb_hits_with_bandwidth: number;
  min_bandwidth: number | undefined;
  max_bandwidth: number | undefined;
  goals: Record<string, MatomoGoal>;
  sum_daily_nb_uniq_visitors: number;
  exit_nb_visits: number;
  sum_daily_exit_nb_uniq_visitors: number;
  entry_nb_visits: number;
  entry_nb_actions: number;
  entry_sum_visit_length: number;
  entry_bounce_count: number;
  sum_daily_entry_nb_uniq_visitors: number;
  avg_time_on_page: number;
  bounce_rate: string;
  exit_rate: string;
  avg_bandwidth: number;
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
