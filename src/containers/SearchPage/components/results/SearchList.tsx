/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from "lodash-es";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  AudioSummaryDTO,
  AudioSummarySearchResultDTO,
  SeriesSummaryDTO,
  SeriesSummarySearchResultDTO,
} from "@ndla/types-backend/audio-api";
import { ConceptSearchResultDTO, ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { ImageMetaInformationV3DTO, SearchResultV3DTO } from "@ndla/types-backend/image-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import SearchResult, { SearchResultReturnType } from "./SearchResult";
import { LocaleType, SearchParams, SearchType } from "../../../../interfaces";
import { useAuth0Users } from "../../../../modules/auth0/auth0Queries";
import { MultiSummarySearchResults } from "../../../../modules/search/searchApiInterfaces";

export type ResultType =
  | SearchResultV3DTO
  | ConceptSearchResultDTO
  | SeriesSummarySearchResultDTO
  | AudioSummarySearchResultDTO
  | MultiSummarySearchResults;

export type ResultSummaryType =
  | ImageMetaInformationV3DTO
  | ConceptSummaryDTO
  | SeriesSummaryDTO
  | AudioSummaryDTO
  | MultiSearchSummaryDTO;

interface Props {
  results: ResultType["results"];
  searching: boolean;
  searchObject: SearchParams;
  type: SearchType;
  locale: LocaleType;
  error: boolean;
}

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const toResultReturnType = (results: ResultType["results"], type: SearchType): SearchResultReturnType[] =>
  results.map((result: ResultSummaryType) => ({ type: type, value: result }));

const SearchList = ({ results, searchObject, type, searching = true, locale, error }: Props) => {
  const { t } = useTranslation();

  const responsibleIds = useMemo(() => {
    const ids = results.reduce<string[]>((acc, curr) => {
      if ("responsible" in curr && curr.responsible) {
        return acc.concat(curr.responsible.responsibleId);
      }
      return acc;
    }, []);

    return Array.from(new Set(ids));
  }, [results]);

  const auth0Responsibles = useAuth0Users({ uniqueUserIds: responsibleIds.join(",") }, {});

  const keyedResponsibles = useMemo(() => {
    return keyBy(auth0Responsibles.data, (responsible) => responsible.app_metadata.ndla_id);
  }, [auth0Responsibles.data]);

  if (searching) return <Spinner />;
  if (error) return <Text color="text.error">{t("searchForm.error")}</Text>;
  if (results.length === 0) return <Text>{t(`searchPage.${type}NoHits`, { query: searchObject.query ?? "" })}</Text>;
  return (
    <StyledUl>
      {toResultReturnType(results, type).map((result) => {
        const learningResourceType = "learningResourceType" in result.value ? result.value.learningResourceType : "";
        const responsibleName =
          "responsible" in result.value ? keyedResponsibles[result.value.responsible.responsibleId]?.name : undefined;

        return (
          <SearchResult
            key={`${result.value.id}-${learningResourceType}`}
            result={result}
            locale={locale || result.value.title.language}
            responsibleName={responsibleName}
          />
        );
      })}
    </StyledUl>
  );
};

export default SearchList;
