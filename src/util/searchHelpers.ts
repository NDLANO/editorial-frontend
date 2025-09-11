/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchParamsBody } from "../containers/SearchPage/components/form/SearchForm";

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

export const transformSearchBody = (searchBody: SearchParamsBody) => {
  const articleTypes = getArticleTypesField(searchBody.resourceTypes);
  const contextTypes = getContextTypes(searchBody.resourceTypes, searchBody.contextTypes || []);

  return {
    ...searchBody,
    ...articleTypes,
    ...contextTypes,
  };
};
