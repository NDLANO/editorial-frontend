/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
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

type Props = BaseProps & tType & RouteComponentProps;

interface State {
  subjects: SubjectType[];
  results: ResultType | undefined;
  isSearching: boolean;
}

class SearchContainer extends React.Component<Props, State> {
  static contextType = LocaleContext;
  context!: React.ContextType<typeof LocaleContext>;

  constructor(props: Props) {
    super(props);
    this.state = {
      subjects: [],
      results: undefined,
      isSearching: true,
    };
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.onQueryPush = debounce(this.onQueryPush.bind(this), 300);
  }

  componentDidMount() {
    const { location, searchFunction } = this.props;
    if (location.search) {
      const searchObject = queryString.parse(location.search);
      this.setState({ isSearching: true });
      searchFunction(searchObject).then((results: ResultType) => {
        this.setState({ results, isSearching: false });
      });
    }
    this.getExternalData();
  }

  async getExternalData() {
    const subjects = await fetchSubjects(this.context);
    this.setState({ subjects });
  }

  onQueryPush(newSearchObject: SearchParams) {
    const { location, history, type, searchFunction } = this.props;
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(key => searchQuery[key] === '' && delete searchQuery[key]);
    this.setState({ isSearching: true });
    searchFunction(searchQuery).then((results: ResultType) => {
      this.setState({ results, isSearching: false });
    });

    history.push(toSearch(searchQuery, type));
  }

  onSortOrderChange(sort: string): void {
    this.onQueryPush({ sort, page: 1 });
  }

  render() {
    const { t, type, location } = this.props;
    const { subjects, results, isSearching } = this.state;

    const lastPage = results?.totalCount
      ? Math.ceil(results?.totalCount / (results.pageSize ?? 1))
      : 1;

    const searchObject = parseSearchParams(location.search);

    return (
      <LocaleContext.Consumer>
        {locale => (
          <UserAccessContext.Consumer>
            {userAccess => (
              <OneColumn>
                <h2>
                  <Search className="c-icon--medium" />
                  {t(`searchPage.header.${type}`)}
                </h2>
                <SearchForm
                  type={type}
                  search={this.onQueryPush}
                  searchObject={searchObject}
                  locale={locale}
                  subjects={subjects}
                />
                <SearchSort location={location} onSortOrderChange={this.onSortOrderChange} />
                <SearchListOptions
                  type={type}
                  searchObject={searchObject}
                  totalCount={results?.totalCount}
                  search={this.onQueryPush}
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
                  onClick={this.onQueryPush}
                />
              </OneColumn>
            )}
          </UserAccessContext.Consumer>
        )}
      </LocaleContext.Consumer>
    );
  }

  static propTypes = {
    type: PropTypes.oneOf(SearchTypeValues).isRequired,
    searchFunction: PropTypes.func.isRequired,
  };
}

export default withRouter(injectT(SearchContainer));
