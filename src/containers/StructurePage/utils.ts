/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MatomoPageData, MatomoResponse } from "../../modules/matomo/matomoApi";

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type DataKeysType = "nb_visits" | "sum_time_spent";

const sumValueEntries = (data: MatomoPageData[], key: DataKeysType): number =>
  data.reduce((acc, cur) => acc + cur[key], 0);

export interface ResourceStats extends Pick<MatomoPageData, DataKeysType> {
  year: number;
}

export const transformMatomoData = (data: PromiseSettledResult<MatomoResponse>[]): Record<string, ResourceStats> => {
  const transformed = data.reduce<Record<string, ResourceStats>>((acc, cur) => {
    if (cur.status === "fulfilled") {
      const year = Object.keys(cur.value)[0];
      if (!year || !cur.value[year].length || !cur.value[year][0].url) return acc;
      const { pathname } = new URL(cur.value[year][0].url);
      const pathnameWithoutLanguage = pathname.replace(/^\/(nb|nn|en)(?=\/)/, "");

      acc[pathnameWithoutLanguage] = {
        year: Number(year),
        nb_visits: sumValueEntries(cur.value[year], "nb_visits"),
        sum_time_spent: sumValueEntries(cur.value[year], "sum_time_spent"),
      };
    }
    return acc;
  }, {});
  return transformed;
};
