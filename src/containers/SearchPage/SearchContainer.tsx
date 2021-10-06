/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import Pager from '@ndla/pager';
import { Search } from '@ndla/icons/common';
import debounce from 'lodash/debounce';
import BEMHelper from 'react-bem-helper';
import { RouteComponentProps, withRouter } from 'react-router';
import hoistNonReactStatics from 'hoist-non-react-statics';
import SearchList from './components/results/SearchList';
import SearchListOptions from './components/results/SearchListOptions';
import SearchForm, { parseSearchParams, SearchParams } from './components/form/SearchForm';
import SearchSort from './components/sort/SearchSort';
import { toSearch } from '../../util/routeHelpers';
import { LocaleContext, UserAccessContext } from '../App/App';
import { LocaleType, SearchType } from '../../interfaces';
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

type Props = BaseProps & RouteComponentProps & { locale: LocaleType };

function withLocale<P>(
  WrappedComponent: React.ComponentType<P & { locale: LocaleType }>,
): React.ComponentType<P> {
  const WithLocale = (props: P): React.ReactElement<P> => {
    return (
      <LocaleContext.Consumer>
        {(locale: LocaleType) => <WrappedComponent {...{ ...props, locale }} />}
      </LocaleContext.Consumer>
    );
  };
  return hoistNonReactStatics(WithLocale, WrappedComponent);
}

const SearchContainer = ({ locale, searchHook, type, location, history }: Props) => {
  const { t } = useTranslation();
  const { data: subjectData } = useSubjects(locale);
  const { data: results, isLoading: isSearching } = searchHook(queryString.parse(location.search));

  const subjects = subjectData ?? [];

  const _onQueryPush = (newSearchObject: SearchParams) => {
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    const newQuery = Object.entries(searchQuery).reduce((prev, [currKey, currVal]) => {
      const validValue = currVal !== '' && currVal !== undefined;
      return validValue ? { ...prev, [currKey]: currVal } : prev;
    }, {});

    history.push(toSearch(newQuery, type));
  };

  const onQueryPush = debounce(_onQueryPush, 300);

  const onSortOrderChange = (sort: string): void => {
    onQueryPush({ sort, page: 1 });
  };

  const lastPage = results?.totalCount
    ? Math.ceil(results?.totalCount / (results.pageSize ?? 1))
    : 1;

  const searchObject = parseSearchParams(location.search);

  return (
    <UserAccessContext.Consumer>
      {userAccess => (
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
              userAccess={userAccess}
            />
            <Pager
              page={searchObject.page ?? 1}
              lastPage={lastPage}
              query={searchObject}
              onClick={onQueryPush}
            />
          </OneColumn>
        </>
      )}
    </UserAccessContext.Consumer>
  );
};

export default withRouter(withLocale(SearchContainer));
