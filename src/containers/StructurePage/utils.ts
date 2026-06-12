/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { keyBy } from "@ndla/util";
import { MatomoPageData, MatomoResponse } from "../../modules/matomo/matomoApi";
import { NoNodeResultTypes } from "../../modules/search/searchApiInterfaces";
import { getContentUriInfo } from "../../util/taxonomyHelpers";

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type DataKeysType = "nb_visits" | "avg_time_on_page" | "nb_hits";

export type ResourceGroup = "core" | "supplementary" | "learningpath" | "link";

const sumValueEntries = (data: MatomoPageData[], key: DataKeysType): number =>
  data.reduce((acc, cur) => acc + cur[key], 0);

export interface ResourceStats extends Pick<MatomoPageData, DataKeysType> {}

const getEntriesWithData = (value: MatomoResponse): MatomoPageData[] => {
  if (Array.isArray(value)) {
    return value.flatMap(getEntriesWithData);
  }
  return Object.values(value)
    .filter((entry) => !!entry.length)
    .flat();
};

export const transformMatomoData = (data: PromiseSettledResult<MatomoResponse>[]): Record<string, ResourceStats> => {
  const transformed = data.reduce<Record<string, ResourceStats>>((acc, cur) => {
    if (cur.status === "fulfilled") {
      const entriesWithData = getEntriesWithData(cur.value);
      if (!entriesWithData.length) return acc;

      const contextId = entriesWithData[0].label.split("/").pop();

      if (!contextId) return acc;

      acc[contextId] = {
        nb_visits: sumValueEntries(entriesWithData, "nb_visits"),
        avg_time_on_page: Math.ceil(sumValueEntries(entriesWithData, "avg_time_on_page") / entriesWithData.length),
        nb_hits: sumValueEntries(entriesWithData, "nb_hits"),
      };
    }
    return acc;
  }, {});
  return transformed;
};

export const RESOURCE_SECTION_ID = "resource-section";

export const extrapolateNodeResourcesFromSearch = (contentUris: string[], results: MultiSearchSummaryDTO[]) => {
  const keyed = keyBy<MultiSearchSummaryDTO, string>(
    results,
    (r) => `urn:${r.learningResourceType === "learningpath" ? "learningpath" : "article"}:${r.id}`,
  );

  return contentUris.reduce<MultiSearchSummaryDTO[]>((acc, curr) => {
    const res = keyed[curr];
    if (!res) return acc;
    acc.push(res);
    return acc;
  }, []);
};

export const getSearchParamsFromContentUris = (contentUris: string[]) => {
  const { ids, resultTypes } = contentUris.reduce<{ ids: Set<number>; resultTypes: Set<NoNodeResultTypes> }>(
    (acc, curr) => {
      const info = getContentUriInfo(curr);
      if (!info) return acc;
      acc.ids.add(info.id);
      acc.resultTypes.add(info.type === "learningpath" ? "learningpath" : "draft");
      return acc;
    },
    { ids: new Set<number>(), resultTypes: new Set<NoNodeResultTypes>() },
  );
  return { ids: Array.from(ids), resultTypes: Array.from(resultTypes), pageSize: ids.size * resultTypes.size };
};
