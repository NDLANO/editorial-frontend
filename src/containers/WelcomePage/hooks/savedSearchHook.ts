/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IAudioSummarySearchResult,
  ISearchParams as IAudioSearchParams,
  ISeriesSearchParams,
  ISeriesSummarySearchResult,
} from "@ndla/types-backend/audio-api";
import { IConceptSearchResult, IDraftConceptSearchParams } from "@ndla/types-backend/concept-api";
import { IUserData } from "@ndla/types-backend/draft-api";
import { ISearchResultV3, ISearchParams as IImageSearchParams } from "@ndla/types-backend/image-api";
import { IDraftSearchParams, IMultiSearchResult } from "@ndla/types-backend/search-api";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import { FAVOURITES_SUBJECT_ID, LMA_SUBJECT_ID, SA_SUBJECT_ID, DA_SUBJECT_ID } from "../../../constants";
import { SearchResultBase } from "../../../interfaces";
import { postSearchAudio, postSearchSeries } from "../../../modules/audio/audioApi";
import { useAuth0Users } from "../../../modules/auth0/auth0Queries";
import { postSearchConcepts } from "../../../modules/concept/conceptApi";
import { postSearchImages } from "../../../modules/image/imageApi";
import { fetchNode } from "../../../modules/nodes/nodeApi";
import { usePostSearchNodes } from "../../../modules/nodes/nodeQueries";
import { postSearch } from "../../../modules/search/searchApi";
import { fetchResourceType } from "../../../modules/taxonomy";
import { SearchParamsBody, parseSearchParams } from "../../SearchPage/components/form/SearchForm";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { customFieldsBody, defaultSubjectIdObject, getResultSubjectIdObject, getSubjectsIdsQuery } from "../utils";

type QueryType =
  | IAudioSearchParams
  | IDraftConceptSearchParams
  | IImageSearchParams
  | ISeriesSearchParams
  | IDraftSearchParams;

type SearchFetchReturnType =
  | IAudioSummarySearchResult
  | IConceptSearchResult
  | ISearchResultV3
  | ISeriesSummarySearchResult
  | IMultiSearchResult;

type SearchFetchType = (query: QueryType) => Promise<SearchFetchReturnType>;

export const searchTypeToFetchMapping: Record<string, SearchFetchType> = {
  audio: postSearchAudio,
  concept: postSearchConcepts,
  image: postSearchImages,
  "podcast-series": postSearchSeries,
  content: postSearch,
};

const getSubjectFilterTranslation = (subject: string, subjectData: Node[], t: TFunction) => {
  switch (subject) {
    case FAVOURITES_SUBJECT_ID:
      return t("searchForm.favourites");
    case LMA_SUBJECT_ID:
      return t("searchForm.LMASubjects");
    case DA_SUBJECT_ID:
      return t("searchForm.DASubjects");
    case SA_SUBJECT_ID:
      return t("searchForm.SASubjects");
    default:
      return subjectData?.find((s) => s.id === subject)?.name;
  }
};

interface SavedSearchObjectType {
  text: string;
  url: string;
}

interface SearchUrlQueryData {
  searchObjects: SearchObjectType[];
  getSavedSearchData: (searchObjects: SearchObjectType[]) => SavedSearchObjectType[];
  loading: boolean;
  error: boolean;
}

type SearchObjectType = SearchParamsBody & { type: string };

export const useSavedSearchUrl = (currentUserData: IUserData | undefined): SearchUrlQueryData => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { savedSearches: searchText, favoriteSubjects } = currentUserData || {};

  const [subjectData, setSubjectData] = useState<Node[]>([]);
  const [resourceTypeData, setResourceTypeData] = useState<ResourceType[]>([]);
  const [searchResultData, setSearchResultData] = useState<SearchResultBase<any>[]>([]);
  const [dataFetchLoading, setDataFetchLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);

  const searchQuery = usePostSearchNodes(
    { ...customFieldsBody(currentUserData?.userId ?? ""), taxonomyVersion },
    { enabled: !!currentUserData?.userId },
  );
  const subjectIdObject = useMemo(() => {
    if (!currentUserData?.userId || !searchQuery.data) return defaultSubjectIdObject;
    return getResultSubjectIdObject(currentUserData.userId, searchQuery.data.results);
  }, [currentUserData?.userId, searchQuery.data]);

  const searchObjects = useMemo(
    () =>
      searchText?.map((st) => {
        const [searchUrl, searchParams] = st.split("?");

        const searchObject = parseSearchParams(searchParams, true);
        const searchObjectWithType = { ...searchObject, type: searchUrl.replace("/search/", "") };

        if (searchObjectWithType["users"]) {
          searchObjectWithType["users"] = searchObjectWithType["users"].map((u) => u.replaceAll('"', ""));
        }
        if (searchObjectWithType["type"] === "content" && searchObject["language"]) {
          searchObjectWithType["language"] = i18n.language;
        }
        return searchObjectWithType as SearchObjectType;
      }) ?? [],
    [i18n.language, searchText],
  );
  useEffect(() => {
    (async () => {
      try {
        setDataFetchLoading(true);
        setDataFetchError(false);
        const searchResultData = await Promise.all(
          searchObjects.map(async (searchObject) => {
            const searchFunction = searchTypeToFetchMapping[searchObject["type"] ?? "content"] ?? postSearch;

            const actualQuery = getSubjectsIdsQuery(searchObject, favoriteSubjects, subjectIdObject);
            const searchResult = await searchFunction({ ...actualQuery, pageSize: 0 });
            return searchResult;
          }),
        );

        setSearchResultData(searchResultData);
        const subjects = searchObjects
          .map((searchObject) => searchObject["subjects"])
          .filter(
            (searchObject) =>
              searchObject &&
              !searchObject.includes(FAVOURITES_SUBJECT_ID) &&
              !searchObject.includes(LMA_SUBJECT_ID) &&
              !searchObject.includes(DA_SUBJECT_ID) &&
              !searchObject.includes(SA_SUBJECT_ID),
          );
        const subjectData = await Promise.all(
          subjects.map((subject) =>
            fetchNode({
              id: subject!.join(""),
              language: i18n.language,
              taxonomyVersion,
            }),
          ),
        );
        setSubjectData(subjectData);

        const resourceTypes = searchObjects.map((searchObject) => searchObject?.resourceTypes).filter((r) => r);
        const resourceTypesData = await Promise.all(
          resourceTypes.map((resourceType) =>
            fetchResourceType({
              id: resourceType!.join(""),
              language: i18n.language,
              taxonomyVersion,
            }),
          ),
        );
        setResourceTypeData(resourceTypesData);
        setDataFetchLoading(false);
      } catch {
        setDataFetchError(true);
      }
    })();
  }, [searchObjects, favoriteSubjects, taxonomyVersion, i18n.language, currentUserData?.userId, subjectIdObject]);

  const userIds = useMemo(() => searchObjects.filter((s) => s.users).map((u) => u.users), [searchObjects]);

  const {
    data: userData,
    isLoading: auth0UsersLoading,
    error: auth0UsersError,
  } = useAuth0Users(
    { uniqueUserIds: userIds.join(",") },
    {
      enabled: !!userIds.length,
    },
  );

  const responsibleIds = useMemo(
    () => searchObjects.filter((s) => s.responsibleIds).map((r) => r.responsibleIds),
    [searchObjects],
  );

  const {
    data: responsibleData,
    isLoading: auth0ResponsiblesLoading,
    error: auth0ResponsiblesError,
  } = useAuth0Users(
    { uniqueUserIds: responsibleIds.join(",") },
    {
      enabled: !!responsibleIds.length,
    },
  );

  const loading = useMemo(
    () => auth0ResponsiblesLoading || auth0UsersLoading || dataFetchLoading,
    [auth0ResponsiblesLoading, auth0UsersLoading, dataFetchLoading],
  );
  const error = useMemo(
    () => !!auth0ResponsiblesError || !!auth0UsersError || dataFetchError,
    [auth0ResponsiblesError, auth0UsersError, dataFetchError],
  );

  const filterToSearchTextMapping = (searchObject: SearchObjectType): (string | undefined)[] => {
    return [
      searchObject.type && t(`searchTypes.${searchObject.type}`),
      searchObject.query && `"${searchObject.query}"`,
      searchObject.language && t(`languages.${searchObject.language}`),
      searchObject.subjects && getSubjectFilterTranslation(searchObject.subjects.join(""), subjectData, t),
      searchObject.resourceTypes && resourceTypeData?.find((r) => r.id === searchObject.resourceTypes?.join(""))?.name,
      searchObject.audioType,
      searchObject.articleTypes && t(`articleType.${searchObject.articleTypes}`),
      searchObject.draftStatus && t(`form.status.${searchObject.draftStatus.join("").toLowerCase()}`),
      searchObject.contextTypes && t(`contextTypes.topic`),
      searchObject.users &&
        `${t("searchForm.tagType.users")}: ${userData?.find(
          (u) => u.app_metadata.ndla_id === searchObject.users?.join(""),
        )?.name}`,
      searchObject.responsibleIds &&
        `${t(`searchForm.tagType.responsible-ids`)}: ${responsibleData?.find(
          (r) => r.app_metadata.ndla_id === searchObject.responsibleIds?.join(""),
        )?.name}`,
      searchObject.license && searchObject.license,
      searchObject.modelReleased && t(`imageSearch.modelReleased.${searchObject.modelReleased}`),
      searchObject.filterInactive === false ? t("searchForm.archivedIncluded") : undefined,
      searchObject.conceptType && t(`searchForm.conceptType.${searchObject.conceptType}`),
    ];
  };

  const getSavedSearchData = (searchObjects: SearchObjectType[]): SavedSearchObjectType[] =>
    searchObjects.map((searchObject, index) => {
      const searchText = currentUserData?.savedSearches?.[index] ?? "";
      const url =
        searchObject["type"] === "content"
          ? searchText.replace(`language=${searchObject["language"]}`, `language=${i18n.language}`)
          : searchText;

      const resultData = filterToSearchTextMapping(searchObject);
      const resultDataSting = resultData.filter((r) => !!r).join(" + ");

      const resultHitsString = searchResultData !== undefined ? ` (${searchResultData?.[index]?.totalCount})` : "";

      return { text: `${resultDataSting}${resultHitsString}`, url: url };
    });

  return {
    searchObjects: searchObjects,
    getSavedSearchData: getSavedSearchData,
    loading: loading,
    error: error,
  };
};
