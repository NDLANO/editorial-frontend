/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getCurrentPageData = <T>(page: number, data: T[], pageSize: number): T[] => {
  // Pagination logic. startIndex indicates start position in data for current page
  // currentPageElements is data to be displayed at current page
  const startIndex = page > 1 ? (page - 1) * pageSize : 0;
  const currentPageElements = data.slice(startIndex, startIndex + pageSize);
  return currentPageElements ?? [];
};
