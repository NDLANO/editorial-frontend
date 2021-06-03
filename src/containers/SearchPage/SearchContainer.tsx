/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import Pager from '@ndla/pager';
import { Search } from '@ndla/icons/common';
import debounce from 'lodash/debounce';
import BEMHelper from 'react-bem-helper';
import { useLocation, useHistory } from 'react-router-dom';
import SearchList from './components/results/SearchList';
import SearchListOptions from './components/results/SearchListOptions';
import SearchForm, { parseSearchParams, SearchParams } from './components/form/SearchForm';
import SearchSort from './components/sort/SearchSort';
import { toSearch } from '../../util/routeHelpers';
import { fetchSubjects } from '../../modules/taxonomy';
import { LocaleContext, UserAccessContext } from '../App/App';
import { SearchType, SubjectType } from '../../interfaces';
import { ImageSearchResult } from '../../modules/image/imageApiInterfaces';
import { ConceptSearchResult } from '../../modules/concept/conceptApiInterfaces';
import { AudioSearchResult, SeriesSearchResult } from '../../modules/audio/audioApiInterfaces';
import { MultiSearchResult } from '../../modules/search/searchApiInterfaces';
import { SearchTypeValues } from '../../constants';

export const searchClasses = new BEMHelper({
  name: 'search',
  prefix: 'c-',
});

export type ResultType =
  | ImageSearchResult
  | ConceptSearchResult
  | SeriesSearchResult
  | AudioSearchResult
  | MultiSearchResult;

interface BaseProps {
  type: SearchType;
  searchFunction: (query: SearchParams) => Promise<ResultType>;
}

type Props = BaseProps & tType;

const SearchContainer = ({ type, searchFunction, t }: Props) => {
  const locale = useContext(LocaleContext);
  const userAccess = useContext(UserAccessContext);

  const location = useLocation();
  const { push } = useHistory();

  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  const [results, setResults] = useState<ResultType | undefined>();
  const [isSearching, setSearching] = useState(true);
  const lastPage = results?.totalCount
    ? Math.ceil(results?.totalCount / (results.pageSize ?? 1))
    : 1;

  const searchObject = parseSearchParams(location.search);

  const onQueryPush = debounce(
    useCallback(
      (newSearchObject: SearchParams) => {
        const oldSearchObject = queryString.parse(location.search);
        const searchQuery = {
          ...oldSearchObject,
          ...newSearchObject,
        };

        // Remove unused/empty query params
        Object.keys(searchQuery).forEach(key => searchQuery[key] === '' && delete searchQuery[key]);

        setSearching(true);
        searchFunction(searchQuery).then((result: ResultType) => {
          setSearching(false);
          setResults(result);
        });

        push(toSearch(searchQuery, type));
      },
      [push, location.search, searchFunction, type],
    ),
    300,
  );

  const onSortOrderChange = (sort: string): void => {
    onQueryPush({ sort, page: '1' });
  };

  useEffect(() => {
    fetchSubjects(locale).then((s: SubjectType[]) => setSubjects(s));
    if (location.search) {
      const searchObject = queryString.parse(location.search);
      searchFunction(searchObject).then((result: ResultType) => {
        setSearching(false);
        setResults(result);
      });
    }
  }, [locale, location.search, searchFunction, type]);

  return (
    <OneColumn>
      <h2>
        <Search className="c-icon--medium" />
        {t(`searchPage.header.${type}`)}
      </h2>
      <SearchForm
        type={type}
        search={onQueryPush}
        searchObject={searchObject}
        locale={locale}
        subjects={subjects}
      />
      <SearchSort location={location} onSortOrderChange={onSortOrderChange} />
      <SearchListOptions
        type={type}
        searchObject={searchObject}
        totalCount={results?.totalCount}
        search={onQueryPush}
      />
      <SearchList
        searchObject={searchObject}
        results={results?.results ?? []}
        searching={isSearching}
        type={type}
        locale={locale}
        subjects={subjects}
        userAccess={userAccess}
      />
      <Pager
        page={searchObject.page ?? 1}
        lastPage={lastPage}
        query={searchObject}
        onClick={onQueryPush}
      />
    </OneColumn>
  );
};

SearchContainer.propTypes = {
  type: PropTypes.oneOf(SearchTypeValues).isRequired,
  searchFunction: PropTypes.func.isRequired,
};

export default injectT(SearchContainer);
