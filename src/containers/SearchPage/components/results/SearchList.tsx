/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IAudioSummary, ISeriesSummary } from '@ndla/types-backend/audio-api';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import SearchResult, { SearchResultReturnType } from './SearchResult';
import Spinner from '../../../../components/Spinner';
import { ResultType } from '../../SearchContainer';
import { SearchParams } from '../form/SearchForm';
import { LocaleType, SearchType } from '../../../../interfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

export type ResultSummaryType =
  | IImageMetaInformationV3
  | IConceptSummary
  | ISeriesSummary
  | IAudioSummary
  | IMultiSearchSummary;

interface Props {
  results: ResultType['results'];
  searching: boolean;
  searchObject: SearchParams;
  type: SearchType;
  locale: LocaleType;
  subjects: SubjectType[];
}

const toResultReturnType = (
  results: ResultType['results'],
  type: SearchType,
): SearchResultReturnType[] =>
  results.map((result: ResultSummaryType) => ({ type: type, value: result }));

const SearchList = ({ results, searchObject, type, searching = true, locale, subjects }: Props) => {
  const { t } = useTranslation();
  const editingState = useState(false);
  const setEditing = editingState[1];
  useEffect(() => {
    setEditing(false);
  }, [results, setEditing]);

  if (searching) return <Spinner />;
  if (results.length === 0)
    return <p>{t(`searchPage.${type}NoHits`, { query: searchObject.query ?? '' })}</p>;
  return (
    <div>
      {toResultReturnType(results, type).map((result) => {
        const learningResourceType =
          'learningResourceType' in result.value ? result.value.learningResourceType : '';
        return (
          <SearchResult
            key={`${result.value.id}-${learningResourceType}`}
            result={result}
            locale={locale || result.value.title.language}
            subjects={subjects}
            editingState={editingState}
          />
        );
      })}
    </div>
  );
};

export default SearchList;
