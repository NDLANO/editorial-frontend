/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { injectT, tType } from '@ndla/i18n';
import SearchResult from './SearchResult';
import { fetchLicenses } from '../../../../modules/draft/draftApi';
import Spinner from '../../../../components/Spinner';
import { ResultType, searchClasses } from '../../SearchContainer';
import { SearchParams } from '../form/SearchForm';
import { License, LocaleType, SearchType, SubjectType } from '../../../../interfaces';
import { ImageSearchSummaryApiType } from '../../../../modules/image/imageApiInterfaces';
import { SearchConceptType } from '../../../../modules/concept/conceptApiInterfaces';
import {
  AudioSearchResultType,
  SeriesSearchSummary,
} from '../../../../modules/audio/audioApiInterfaces';
import { MultiSearchSummary } from '../../../../modules/search/searchApiInterfaces';

type ResultSummaryType =
  | ImageSearchSummaryApiType
  | SearchConceptType
  | SeriesSearchSummary
  | AudioSearchResultType
  | MultiSearchSummary;

interface Props {
  results: ResultType['results'];
  searching: boolean;
  searchObject: SearchParams;
  type: SearchType;
  locale: LocaleType;
  subjects: SubjectType[];
  userAccess?: string;
}

const SearchList = ({
  results,
  searchObject,
  type,
  t,
  searching,
  locale,
  subjects,
  userAccess,
}: Props & tType) => {
  const editingState = useState(false);
  const setEditing = editingState[1];

  const [licenses, setLicenses] = useState<License[]>();
  useEffect(() => {
    fetchLicenses().then(licenses => setLicenses(licenses));
  }, []);
  useEffect(() => {
    setEditing(false);
  }, [results, setEditing]);

  if (searching) return <Spinner />;
  if (results.length === 0)
    return <p>{t(`searchPage.${type}NoHits`, { query: searchObject.query ?? '' })}</p>;
  return (
    <div {...searchClasses('results')}>
      <TransitionGroup>
        {results.map((result: ResultSummaryType) => (
          <CSSTransition
            key={`transition-${result.id}`}
            classNames={searchClasses('transition').className}
            timeout={{ enter: 500, exit: 0 }}>
            <SearchResult
              key={result.id}
              result={result}
              type={type}
              locale={locale || result.title.language}
              subjects={subjects}
              userAccess={userAccess}
              editingState={editingState}
              licenses={licenses}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

SearchList.defaultProps = {
  searching: true,
};

export default injectT(SearchList);
