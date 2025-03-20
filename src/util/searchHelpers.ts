/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchParamsBody } from "../containers/SearchPage/components/form/SearchForm";

export const transformQuery = ({ "resource-types": resourceTypes, ...rest }: any) => {
  const query = { ...rest };

  if (resourceTypes === "topic-article" || resourceTypes === "frontpage-article") {
    query["article-types"] = resourceTypes;
  } else if (resourceTypes) {
    query["resource-types"] = resourceTypes;
  }
  if (query.users) {
    // in case of weird ID's starting with -
    query["users"] = `"${query["users"]}"`;
  }

  return query;
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
    return { contextTypes: ["gloss"], resourceTypes: [], resultTypes: ["concept"] };
  }
  if (resourceType?.includes("concept")) {
    return { contextTypes: ["concept"], resourceTypes: [], resultTypes: ["concept"] };
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
