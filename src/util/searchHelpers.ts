/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { NoNodeDraftSearchParams } from "../modules/search/searchApiInterfaces";

export const getContentUriFromSearchSummary = (item: MultiSearchSummaryDTO): string => {
  const type = item.learningResourceType === "learningpath" ? "learningpath" : "article";
  return `urn:${type}:${item.id}`;
};

const getArticleTypesField = (resourceTypes?: string[]) => {
  if (!resourceTypes?.length) {
    return {};
  }
  if (resourceTypes?.includes("topic-article") || resourceTypes?.includes("frontpage-article"))
    return { articleTypes: resourceTypes, resourceTypes: [] };
  else return {};
};

const getContextTypes = (resourceType: string[] | undefined, contextTypes: string[]) => {
  if (resourceType?.includes("gloss")) {
    return { contextTypes: ["gloss"], resourceTypes: [] };
  }
  if (resourceType?.includes("concept")) {
    return { contextTypes: ["concept"], resourceTypes: [] };
  }
  if (resourceType?.includes("learningpath")) {
    return { contextTypes: ["learningpath"], resourceTypes: [] };
  }

  return { contextTypes };
};

export const transformSearchBody = (searchBody: NoNodeDraftSearchParams) => {
  const articleTypes = getArticleTypesField(searchBody.resourceTypes);
  const contextTypes = getContextTypes(searchBody.resourceTypes, searchBody.contextTypes || []);

  return {
    ...searchBody,
    ...articleTypes,
    ...contextTypes,
  };
};
