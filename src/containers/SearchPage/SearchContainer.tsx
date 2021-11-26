/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import Pager from '@ndla/pager';
import { Search } from '@ndla/icons/common';
import debounce from 'lodash/debounce';
import BEMHelper from 'react-bem-helper';
import { RouteComponentProps, withRouter } from 'react-router';
import SearchList from './components/results/SearchList';
import SearchListOptions from './components/results/SearchListOptions';
import SearchForm, { parseSearchParams, SearchParams } from './components/form/SearchForm';
import SearchSort from './components/sort/SearchSort';
import { toSearch } from '../../util/routeHelpers';
import { SearchType } from '../../interfaces';
import { ImageSearchResult } from '../../modules/image/imageApiInterfaces';
import { ConceptSearchResult } from '../../modules/concept/conceptApiInterfaces';
import { AudioSearchResult, SeriesSearchResult } from '../../modules/audio/audioApiInterfaces';
import { MultiSearchResult } from '../../modules/search/searchApiInterfaces';
import SearchSaveButton from './SearchSaveButton';
import { useSubjects } from '../../modules/taxonomy/subjects';

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
  searchHook: (query: SearchParams) => UseQueryResult<ResultType>;
}

type Props = BaseProps & RouteComponentProps;

const SearchContainer = ({ searchHook, type, location, history }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { data: subjectData } = useSubjects(locale);
  const [searchObject, setSearchObject] = useState(parseSearchParams(location.search));
  const { data: results, isLoading: isSearching } = searchHook(searchObject);
  const nextPage = (searchObject?.page ?? 1) + 1;
  // preload next page.
  searchHook({ ...searchObject, page: nextPage });

  useEffect(() => {
    setSearchObject(parseSearchParams(location.search));
  }, [location.search]);

  const subjects = subjectData ?? [];

  const _onQueryPush = (newSearchObject: SearchParams) => {
    const searchQuery = {
      ...searchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    const newQuery = Object.entries(searchQuery).reduce((prev, [currKey, currVal]) => {
      const validValue = currVal !== '' && currVal !== undefined;
      return validValue ? { ...prev, [currKey]: currVal } : prev;
    }, {});
    setSearchObject(newQuery);

    history.push(toSearch(newQuery, type));
  };

  // useMemo ensures that _onQueryPush remains the same.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onQueryPush = useMemo(() => debounce(_onQueryPush, 400), []);

  const onSortOrderChange = (sort: string): void => {
    onQueryPush({ sort, page: 1 });
  };

  const lastPage = results?.totalCount
    ? Math.ceil(results?.totalCount / (results.pageSize ?? 1))
    : 1;

  return (
    <>
      <HelmetWithTracker title={t(`htmlTitles.search.${type}`)} />
      <OneColumn>
        <div {...searchClasses('header')}>
          <h2>
            <Search className="c-icon--medium" />
            {t(`searchPage.header.${type}`)}
          </h2>
          <SearchSaveButton />
        </div>
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
        />
        <Pager
          page={searchObject.page ?? 1}
          lastPage={lastPage}
          query={searchObject}
          onClick={onQueryPush}
        />
      </OneColumn>
    </>
  );
};

export default withRouter(SearchContainer);
