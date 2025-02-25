/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MatomoPageData, MatomoResponse } from "../../modules/matomo/matomoApi";

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export interface ResourceStats extends Pick<MatomoPageData, "nb_visits" | "avg_time_on_page"> {
  year: string;
}

export const transformMatomoData = (data: PromiseSettledResult<MatomoResponse>[]): Record<string, ResourceStats> => {
  const transformed = data.reduce<Record<string, ResourceStats>>((acc, cur) => {
    if (cur.status === "fulfilled") {
      const year = Object.keys(cur.value)[0];
      if (!year || !cur.value[year].length) return acc;
      const { pathname } = new URL(cur.value[year][0].url);
      acc[pathname] = {
        year: year,
        nb_visits: cur.value[year][0].nb_visits,
        avg_time_on_page: cur.value[year][0].avg_time_on_page,
      };
    }
    return acc;
  }, {});
  return transformed;
};
