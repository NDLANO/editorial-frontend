/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Text } from "@ndla/primitives";
import { IAudioSummary, ISeriesSummary } from "@ndla/types-backend/audio-api";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import SearchResult, { SearchResultReturnType } from "./SearchResult";
import { LocaleType, SearchType } from "../../../../interfaces";
import { useAuth0Users } from "../../../../modules/auth0/auth0Queries";
import { ResultType } from "../../SearchContainer";
import { SearchParams } from "../form/types";

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
    <div>
      {toResultReturnType(results, type).map((result) => {
        const learningResourceType = "learningResourceType" in result.value ? result.value.learningResourceType : "";
        const responsibleName =
          "responsible" in result.value ? keyedResponsibles[result.value.responsible.responsibleId]?.name : undefined;

        return (
          <SearchResult
            key={`${result.value.id}-${learningResourceType}`}
            result={result}
            locale={locale || result.value.title.language}
            subjects={subjects}
            responsibleName={responsibleName}
          />
        );
      })}
    </div>
  );
};

export default SearchList;
