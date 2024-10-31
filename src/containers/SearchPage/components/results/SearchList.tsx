/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniq from "lodash/uniq";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { IAudioSummary, ISeriesSummary } from "@ndla/types-backend/audio-api";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import SearchResult, { SearchResultReturnType } from "./SearchResult";
import Spinner from "../../../../components/Spinner";
import { LocaleType, SearchType } from "../../../../interfaces";
import { fetchAuth0Users } from "../../../../modules/auth0/auth0Api";
import { ResultType } from "../../SearchContainer";
import { SearchParams } from "../form/SearchForm";

const StyledSearchError = styled.p`
  color: ${colors.support.red};
`;

export type ResultSummaryType =
  | IImageMetaInformationV3
  | IConceptSummary
  | ISeriesSummary
  | IAudioSummary
  | IMultiSearchSummary;

interface Props {
  results: ResultType["results"];
  searching: boolean;
  searchObject: SearchParams;
  type: SearchType;
  locale: LocaleType;
  subjects: Node[];
  error: boolean;
}

const toResultReturnType = (results: ResultType["results"], type: SearchType): SearchResultReturnType[] =>
  results.map((result: ResultSummaryType) => ({ type: type, value: result }));

const SearchList = ({ results, searchObject, type, searching = true, locale, subjects, error }: Props) => {
  const { t } = useTranslation();
  const [responsibleNames, setResponsibleNames] = useState<(string | undefined)[]>([]);

  const responsibleIds = useMemo(
    () =>
      results.map((r) => {
        if ("responsible" in r) {
          return r.responsible?.responsibleId;
        } else return null;
      }),
    [results],
  );

  useEffect(() => {
    (async () => {
      if (!responsibleIds.length) return;
      const formattedResponsibleIds = uniq(responsibleIds.filter((r) => r)).join(",");
      const userData = await fetchAuth0Users(formattedResponsibleIds);
      // UserNames need to be positioned at exact same spot as its corresponsing id to map to correct search result
      const userNames = responsibleIds.flatMap((r) =>
        r ? userData.filter((u) => u?.app_metadata?.ndla_id === r).map((user) => user.name) : undefined,
      );
      setResponsibleNames(userNames);
    })();
  }, [responsibleIds]);

  if (searching) return <Spinner />;
  if (error) return <StyledSearchError>{t("searchForm.error")}</StyledSearchError>;
  if (results.length === 0) return <p>{t(`searchPage.${type}NoHits`, { query: searchObject.query ?? "" })}</p>;
  return (
    <div>
      {toResultReturnType(results, type).map((result, index) => {
        const learningResourceType = "learningResourceType" in result.value ? result.value.learningResourceType : "";
        return (
          <SearchResult
            key={`${result.value.id}-${learningResourceType}`}
            result={result}
            locale={locale || result.value.title.language}
            subjects={subjects}
            responsibleName={responsibleNames?.[index]}
          />
        );
      })}
    </div>
  );
};

export default SearchList;
