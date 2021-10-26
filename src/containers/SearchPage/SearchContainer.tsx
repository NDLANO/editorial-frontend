/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { withTranslation, WithTranslation } from 'react-i18next';
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
import { fetchSubjects } from '../../modules/taxonomy';
import { LocaleContext } from '../App/App';
import { LocaleType, SearchType } from '../../interfaces';
import { ImageSearchResult } from '../../modules/image/imageApiInterfaces';
import { ConceptSearchResult } from '../../modules/concept/conceptApiInterfaces';
import { AudioSearchResult, SeriesSearchResult } from '../../modules/audio/audioApiInterfaces';
import { MultiSearchResult } from '../../modules/search/searchApiInterfaces';
import { SearchTypeValues } from '../../constants';
import { SubjectType } from '../../modules/taxonomy/taxonomyApiInterfaces';
import SearchSaveButton from './SearchSaveButton';

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

type Props = BaseProps & WithTranslation & RouteComponentProps & { locale: LocaleType };

interface State {
  subjects: SubjectType[];
  results: ResultType | undefined;
  isSearching: boolean;
}

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

class SearchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subjects: [],
      results: undefined,
      isSearching: true,
    };
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.getExternalData = this.getExternalData.bind(this);
    this.onQueryPush = debounce(this.onQueryPush.bind(this), 300);
    this.search = this.search.bind(this);
  }

  search(): void {
    const { location, searchFunction } = this.props;
    if (location.search || this.props.type) {
      const searchObject = queryString.parse(location.search);
      this.setState({ isSearching: true });
      searchFunction(searchObject)
        .then((results: ResultType) => {
          this.setState({ results, isSearching: false });
        })
        .catch(() => {
          this.setState({ isSearching: false });
        });
    }
  }

  componentDidMount() {
    this.search();
    this.getExternalData();
  }

  componentDidUpdate(prevProps: Props) {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      this.search();
    }
  }

  async getExternalData() {
    const subjects = await fetchSubjects(this.props.locale);
    this.setState({ subjects });
  }

  onQueryPush(newSearchObject: SearchParams) {
    const { location, history, type } = this.props;
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(key => searchQuery[key] === '' && delete searchQuery[key]);
    history.push(toSearch(searchQuery, type));
  }

  onSortOrderChange(sort: string): void {
    this.onQueryPush({ sort, page: 1 });
  }

  render() {
    const { t, type, locale, location } = this.props;
    const { subjects, results, isSearching } = this.state;

    const lastPage = results?.totalCount
      ? Math.ceil(results?.totalCount / (results.pageSize ?? 1))
      : 1;

    const searchObject = parseSearchParams(location.search);

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
          />
          <Pager page={searchObject.page ?? 1} lastPage={lastPage} query={searchObject} />
        </OneColumn>
      </>
    );
  }

  static propTypes = {
    type: PropTypes.oneOf(SearchTypeValues).isRequired,
    searchFunction: PropTypes.func.isRequired,
  };
}

export default withRouter(withLocale(withTranslation()(SearchContainer)));
