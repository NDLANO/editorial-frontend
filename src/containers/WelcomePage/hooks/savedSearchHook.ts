/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAudioSummarySearchResult, ISeriesSummarySearchResult } from "@ndla/types-backend/audio-api";
import { IConceptSearchResult } from "@ndla/types-backend/concept-api";
import { IUserData } from "@ndla/types-backend/draft-api";
import { ISearchResultV3 } from "@ndla/types-backend/image-api";
import { IMultiSearchResult } from "@ndla/types-backend/search-api";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import { FAVOURITES_SUBJECT_ID, LMA_SUBJECT_ID, TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA } from "../../../constants";
import { SearchObjectType, SearchResultBase } from "../../../interfaces";
import { searchAudio, searchSeries } from "../../../modules/audio/audioApi";
import { AudioSearchParams, SeriesSearchParams } from "../../../modules/audio/audioApiInterfaces";
import { useAuth0Users } from "../../../modules/auth0/auth0Queries";
import { searchConcepts } from "../../../modules/concept/conceptApi";
import { ConceptQuery } from "../../../modules/concept/conceptApiInterfaces";
import { searchImages } from "../../../modules/image/imageApi";
import { ImageSearchQuery } from "../../../modules/image/imageApiInterfaces";
import { fetchNode, fetchNodes } from "../../../modules/nodes/nodeApi";
import { search } from "../../../modules/search/searchApi";
import { MultiSearchApiQuery } from "../../../modules/search/searchApiInterfaces";
import { fetchResourceType } from "../../../modules/taxonomy";
import { transformQuery } from "../../../util/searchHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

type QueryType = AudioSearchParams | ConceptQuery | ImageSearchQuery | SeriesSearchParams | MultiSearchApiQuery;

type SearchFetchReturnType =
  | IAudioSummarySearchResult
  | IConceptSearchResult
  | ISearchResultV3
  | ISeriesSummarySearchResult
  | IMultiSearchResult;

type SearchFetchType = (query: QueryType) => Promise<SearchFetchReturnType>;

export const searchTypeToFetchMapping: Record<string, SearchFetchType> = {
  audio: searchAudio,
  concept: searchConcepts,
  image: searchImages,
  "podcast-series": searchSeries,
  content: search,
};

const getLMASubjectIds = async (taxonomyVersion: string, userId: string | undefined) => {
  const nodes = await fetchNodes({
    taxonomyVersion,
    nodeType: "SUBJECT",
    key: TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA,
    value: userId,
  });
  return nodes?.map((n) => n.id).join(",");
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

export const useSavedSearchUrl = (currentUserData: IUserData | undefined): SearchUrlQueryData => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const { savedSearches: searchText, favoriteSubjects } = currentUserData || {};

  const [subjectData, setSubjectData] = useState<Node[]>([]);
  const [resourceTypeData, setResourceTypeData] = useState<ResourceType[]>([]);
  const [searchResultData, setSearchResultData] = useState<SearchResultBase<any>[]>([]);
  const [dataFetchLoading, setDataFetchLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);

  const searchObjects = useMemo(
    () =>
      searchText?.map((st) => {
        const [searchUrl, searchParams] = st.split("?");
        const searchObject = transformQuery(queryString.parse(searchParams));
        searchObject["type"] = searchUrl.replace("/search/", "");
        if (searchObject["users"]) {
          searchObject["users"] = searchObject["users"].replaceAll('"', "");
        }
        if (searchObject["type"] === "content" && searchObject["language"]) {
          searchObject["language"] = i18n.language;
        }
        return searchObject as SearchObjectType;
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
            const searchFunction = searchTypeToFetchMapping[searchObject["type"] ?? "content"] ?? search;

            const searchObj =
              searchObject.subjects === FAVOURITES_SUBJECT_ID
                ? {
                    ...searchObject,
                    subjects: favoriteSubjects?.join(","),
                  }
                : searchObject.subjects === LMA_SUBJECT_ID
                  ? {
                      ...searchObject,
                      subjects: await getLMASubjectIds(taxonomyVersion, currentUserData?.userId),
                    }
                  : searchObject;

            const searchResult = searchFunction({
              ...searchObj,
              "page-size": 0,
            });

            return searchResult;
          }),
        );
        setSearchResultData(searchResultData);
        const subjects = searchObjects
          .map((searchObject) => searchObject["subjects"])
          .filter(
            (searchObject) =>
              searchObject && !searchObject.includes(FAVOURITES_SUBJECT_ID) && !searchObject.includes(LMA_SUBJECT_ID),
          );
        const subjectData = await Promise.all(
          subjects.map((subject) =>
            fetchNode({
              id: subject ?? "",
              language: i18n.language,
              taxonomyVersion,
            }),
          ),
        );
        setSubjectData(subjectData);

        const resourceTypes = searchObjects.map((searchObject) => searchObject["resource-types"]).filter((r) => r);
        const resourceTypesData = await Promise.all(
          resourceTypes.map((resourceType) =>
            fetchResourceType({
              id: resourceType ?? "",
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
  }, [searchObjects, favoriteSubjects, taxonomyVersion, i18n.language, currentUserData?.userId]);

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
    () => searchObjects.filter((s) => s["responsible-ids"]).map((r) => r["responsible-ids"]),
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

  const filterToSearchTextMapping = (searchObject: SearchObjectType): SearchObjectType => {
    return {
      type: searchObject.type && t(`searchTypes.${searchObject.type}`),
      query: searchObject.query && `"${searchObject.query}"`,
      language: searchObject.language && t(`languages.${searchObject.language}`),
      subjects:
        searchObject.subjects && searchObject.subjects === FAVOURITES_SUBJECT_ID
          ? t("searchForm.favourites")
          : searchObject.subjects === LMA_SUBJECT_ID
            ? t("searchForm.LMASubjects")
            : subjectData?.find((s) => s.id === searchObject.subjects)?.name,
      "resource-types":
        searchObject["resource-types"] && resourceTypeData?.find((r) => r.id === searchObject["resource-types"])?.name,
      "audio-type": searchObject["audio-type"] && searchObject["audio-type"],
      "article-types": searchObject["article-types"] && t(`articleType.${searchObject["article-types"]}`),
      "draft-status": searchObject["draft-status"] && t(`form.status.${searchObject["draft-status"].toLowerCase()}`),
      "context-type": searchObject["context-type"] && t(`contextTypes.topic`),
      users:
        searchObject.users &&
        `${t("searchForm.tagType.users")}: ${userData?.find((u) => u.app_metadata.ndla_id === searchObject.users)
          ?.name}`,
      "responsible-ids":
        searchObject["responsible-ids"] &&
        `${t(`searchForm.tagType.responsible-ids`)}: ${responsibleData?.find(
          (r) => r.app_metadata.ndla_id === searchObject["responsible-ids"],
        )?.name}`,
      license: searchObject.license && searchObject.license,
      "model-released":
        searchObject["model-released"] && t(`imageSearch.modelReleased.${searchObject["model-released"]}`),
      "filter-inactive": searchObject["filter-inactive"] === "false" ? t("searchForm.archivedIncluded") : undefined,
      "concept-type": searchObject["concept-type"] && t(`searchForm.conceptType.${searchObject["concept-type"]}`),
    };
  };

  const getSavedSearchData = (searchObjects: SearchObjectType[]): SavedSearchObjectType[] =>
    searchObjects.map((searchObject, index) => {
      const searchText = currentUserData?.savedSearches?.[index] ?? "";
      const url =
        searchObject["type"] === "content"
          ? searchText.replace(`language=${searchObject["language"]}`, `language=${i18n.language}`)
          : searchText;

      const resultData = filterToSearchTextMapping(searchObject);
      const resultDataSting = Object.values(resultData)
        .filter((r) => !!r)
        .join(" + ");

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
