/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { ISeriesSearchParams, ISearchParams as IAudioSearchParams } from "@ndla/types-backend/audio-api";
import { IDraftConceptSearchParams } from "@ndla/types-backend/concept-api";
import { ISearchParams as IImageSearchParams } from "@ndla/types-backend/image-api";
import { IDraftSearchParams } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import SearchAudioForm from "./SearchAudioForm";
import SearchConceptForm from "./SearchConceptForm";
import SearchContentForm from "./SearchContentForm";
import SearchImageForm from "./SearchImageForm";
import SearchPodcastSeriesForm from "./SearchPodcastSeriesForm";
import { SearchType } from "../../../../interfaces";

export interface SearchParams {
  query?: string;
  "draft-status"?: string;
  "include-other-statuses"?: boolean;
  "resource-types"?: string;
  "article-types"?: string;
  "audio-type"?: string;
  fallback?: boolean;
  language?: string;
  page?: number;
  "page-size"?: number;
  status?: string;
  subjects?: string;
  users?: string;
  sort?: string;
  license?: string;
  "model-released"?: string;
  "revision-date-from"?: string;
  "revision-date-to"?: string;
  "exclude-revision-log"?: boolean | undefined;
  "responsible-ids"?: string;
  "concept-type"?: string;
  "filter-inactive"?: boolean;
}

export type SearchParamsBody = IDraftConceptSearchParams &
  IDraftSearchParams &
  IImageSearchParams &
  IAudioSearchParams &
  ISeriesSearchParams;

type ReturnType<T> = T extends true ? SearchParamsBody : SearchParams;

type MappingType = {
  [K in keyof SearchParamsBody]: {
    key: K;
    data: SearchParamsBody[K];
  };
}[keyof SearchParamsBody];

type SearchBodyKeyMapping = {
  [k in keyof SearchParams]: MappingType;
};

export const parseSearchParams = <T extends boolean>(locationSearch: string, parseAsSearchBody: T): ReturnType<T> => {
  const queryStringObject: Record<string, string | undefined> = queryString.parse(locationSearch);

  const parseBooleanParam = (key: string, fallback = false): boolean => {
    const value = queryStringObject[key];
    if (!value) return fallback;
    return value === "true";
  };

  const parseNumberParam = (key: string): number | undefined => {
    const value = queryStringObject[key];
    if (!value) return undefined;
    return parseInt(value, 10);
  };

  const searchBodyKeyMapping: SearchBodyKeyMapping = {
    "draft-status": { key: "draftStatus", data: queryStringObject["draft-status"]?.split(",") },
    "include-other-statuses": { key: "includeOtherStatuses", data: parseBooleanParam("include-other-statuses") },
    "resource-types": { key: "resourceTypes", data: queryStringObject["resource-types"]?.split(",") },
    "audio-type": { key: "audioType", data: queryStringObject["audio-type"] },
    "concept-type": { key: "conceptType", data: queryStringObject["concept-type"] },
    "model-released": { key: "modelReleased", data: queryStringObject["model-released"]?.split(",") },
    "page-size": { key: "pageSize", data: parseNumberParam("page-size") },
    "revision-date-from": { key: "revisionDateFrom", data: queryStringObject["revision-date-from"] },
    "revision-date-to": { key: "revisionDateTo", data: queryStringObject["revision-date-to"] },
    "exclude-revision-log": { key: "excludeRevisionLog", data: parseBooleanParam("exclude-revision-log") },
    "responsible-ids": { key: "responsibleIds", data: queryStringObject["responsible-ids"]?.split(",") },
    "filter-inactive": { key: "filterInactive", data: parseBooleanParam("filter-inactive", true) },
    query: { key: "query", data: queryStringObject.query },
    language: { key: "language", data: queryStringObject.language },
    page: { key: "page", data: parseNumberParam("page") },
    "article-types": { key: "articleTypes", data: queryStringObject["article-types"]?.split(",") },
    fallback: { key: "fallback", data: parseBooleanParam("fallback") },
    status: { key: "status", data: queryStringObject.status?.split(",") },
    sort: { key: "sort", data: queryStringObject.sort },
    subjects: { key: "subjects", data: queryStringObject.subjects?.split(",") },
    users: { key: "users", data: queryStringObject.users?.split(",") },
    license: { key: "license", data: queryStringObject.license },
  } as const;

  return Object.entries(searchBodyKeyMapping).reduce(
    (acc, [key, val]) => {
      if (val.data === undefined) return acc;
      const updatedKey = parseAsSearchBody ? val.key : key;
      const updatedVal = parseAsSearchBody || !Array.isArray(val.data) ? val.data : queryStringObject[key];
      acc[updatedKey] = updatedVal;
      return acc;
    },
    {} as Record<string, any>,
  ) as SearchParamsBody;
};

interface Props {
  type: SearchType;
  searchObject: SearchParams;
  search: (o: SearchParams) => void;
  subjects: Node[];
  locale: string;
  userId?: string | undefined;
}

const SearchForm = ({ type, searchObject, userId, ...rest }: Props) => {
  switch (type) {
    case "content":
      return <SearchContentForm searchObject={searchObject} userId={userId} {...rest} />;
    case "audio":
      return <SearchAudioForm searchObject={searchObject} {...rest} />;
    case "image":
      return <SearchImageForm searchObject={searchObject} {...rest} />;
    case "concept":
      return <SearchConceptForm searchObject={searchObject} {...rest} />;
    case "podcast-series":
      return <SearchPodcastSeriesForm searchObject={searchObject} {...rest} />;
    default:
      return <p>{`This type: ${type} is not supported`}</p>;
  }
};

export default SearchForm;
