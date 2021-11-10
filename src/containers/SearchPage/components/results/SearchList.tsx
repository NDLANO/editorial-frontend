/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import SearchResult from './SearchResult';
import Spinner from '../../../../components/Spinner';
import { ResultType, searchClasses } from '../../SearchContainer';
import { SearchParams } from '../form/SearchForm';
import { LocaleType, SearchType } from '../../../../interfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { ImageSearchSummaryApiType } from '../../../../modules/image/imageApiInterfaces';
import { SearchConceptType } from '../../../../modules/concept/conceptApiInterfaces';
import {
  AudioSearchResultType,
  SeriesSearchResultType,
} from '../../../../modules/audio/audioApiInterfaces';
import { MultiSearchSummary } from '../../../../modules/search/searchApiInterfaces';

export type ResultSummaryType =
  | ImageSearchSummaryApiType
  | SearchConceptType
  | SeriesSearchResultType
  | AudioSearchResultType
  | MultiSearchSummary;

interface Props {
  results: ResultType['results'];
  searching: boolean;
  searchObject: SearchParams;
  type: SearchType;
  locale: LocaleType;
  subjects: SubjectType[];
}

const SearchList = ({ results, searchObject, type, searching, locale, subjects }: Props) => {
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
    <div {...searchClasses('results')}>
      <TransitionGroup>
        {results.map((result: ResultSummaryType) => {
          const learningResourceType =
            'learningResourceType' in result ? result.learningResourceType : '';
          return (
            <CSSTransition
              key={`transition-${result.id}-${learningResourceType}`}
              classNames={searchClasses('transition').className}
              timeout={{ enter: 500, exit: 0 }}>
              <SearchResult
                key={`${result.id}-${learningResourceType}`}
                result={result}
                type={type}
                locale={locale || result.title.language}
                subjects={subjects}
                editingState={editingState}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};

SearchList.defaultProps = {
  searching: true,
};

export default SearchList;
