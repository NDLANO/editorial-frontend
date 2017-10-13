/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { OneColumn, Pager, Hero } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import * as actions from '../../modules/search/search';
import { SearchResultShape } from '../../shapes';
import {
  getResults,
  getLastPage,
  getSearching,
} from '../../modules/search/searchSelectors';
import { getLocale } from '../../modules/locale/locale';
import SearchList from './components/SearchList';
import SearchTabs from './components/SearchTabs';
import { toSearch } from '../../util/routeHelpers';

export const searchClasses = new BEMHelper({
  name: 'search-results',
  prefix: 'c-',
});

class SearchPage extends Component {
  constructor() {
    super();
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.onArticleSearchTypeChange = this.onArticleSearchTypeChange.bind(this);
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.onQueryPush = this.onQueryPush.bind(this);
  }

  componentWillMount() {
    const { location, search } = this.props;
    if (location.search) {
      search(location.search);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, search } = nextProps;
    if (location.search && location.search !== this.props.location.search) {
      search(location.search);
    }
  }

  onQueryPush(newQuery) {
    const { history } = this.props;
    const oldQuery = queryString.parse(location.search);
    history.push(toSearch({ ...oldQuery, ...newQuery }));
  }

  onSearchTypeChange(types) {
    this.onQueryPush({
      page: 1,
      articleTypes: undefined,
      types: types.join(','),
    });
  }

  onSortOrderChange(sort) {
    this.onQueryPush({ sort, page: 1 });
  }

  onArticleSearchTypeChange(articleTypes) {
    this.onQueryPush({ page: 1, types: 'articles', articleTypes });
  }

  render() {
    const { location, results, locale, lastPage } = this.props;
    const query = queryString.parse(location.search);
    const searchList = (
      <SearchList query={query} locale={locale} results={results} />
    );

    return (
      <div>
        <Hero />
        <OneColumn cssModifier="narrow">
          <div {...searchClasses()}>
            <SearchTabs
              searchTypes={query.types}
              articleType={query.articleTypes}
              tabContent={searchList}
              onSearchTypeChange={this.onSearchTypeChange}
              onArticleSearchTypeChange={this.onArticleSearchTypeChange}
            />
            <Pager
              page={query.page ? parseInt(query.page, 10) : 1}
              lastPage={lastPage}
              query={query}
              pathname={toSearch()}
            />
          </div>
        </OneColumn>
      </div>
    );
  }
}

SearchPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  lastPage: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  search: actions.search,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  results: getResults(state, queryString.parse(location.search).types),
  lastPage: getLastPage(state),
  searching: getSearching(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
