/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { orderBy } from "lodash-es";
import { ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { ArticleSummaryDTO } from "@ndla/types-backend/draft-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Prefix } from "./TableComponent";
import { SortOptionLastUsed } from "../types";

type SortOptionType = Prefix<"-", SortOptionLastUsed>;

export const getCurrentPageData = <T>(page: number, data: T[], pageSize: number): T[] => {
  // Pagination logic. startIndex indicates start position in data for current page
  // currentPageElements is data to be displayed at current page
  const startIndex = page > 1 ? (page - 1) * pageSize : 0;
  const currentPageElements = data.slice(startIndex, startIndex + pageSize);
  return currentPageElements ?? [];
};

export const getSortedPaginationData = <T extends ConceptSummaryDTO | ArticleSummaryDTO | MultiSearchSummaryDTO>(
  page: number,
  sortOption: SortOptionType,
  data: T[],
  pageSize: number,
): T[] => {
  const sortDesc = sortOption.charAt(0) === "-";
  const currentPageElements = getCurrentPageData(page, data, pageSize);

  return orderBy(
    currentPageElements,
    (e) =>
      sortOption.includes("title")
        ? e.title?.title
        : sortOption.includes("status")
          ? e.status?.current
          : "updated" in e
            ? e.updated
            : e.lastUpdated,
    [sortDesc ? "desc" : "asc"],
  );
};
