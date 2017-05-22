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
import { OneColumn, Pager } from 'ndla-ui';

import * as actions from './searchActions';
import { ArticleResultShape } from '../../shapes';
import { getResults, getLastPage, getSearching } from './searchSelectors';
import { getLocale } from '../Locale/localeSelectors';
import SearchForm from './components/SearchForm';
import SearchResultList from './components/SearchResultList';
import SelectSearchSortOrder from './components/SelectSearchSortOrder';
import SelectArticleType from './components/SelectArticleType';
import { toSearch } from '../../routes';

class SearchPage extends Component {

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

  render() {
    const { location, results, locale, searching, lastPage, history } = this.props;
    const query = queryString.parse(location.search);

    return (
      <OneColumn cssModifier="narrow">
        <SearchForm
          query={query.query}
          searching={searching}
          onSearchQuerySubmit={searchQuery => history.push(toSearch({ ...query, query: searchQuery, page: 1, sort: query.sort ? query.sort : '-relevance' }))}
        />

        <SelectArticleType
          articleType={query.articleTypes}
          onArticleTypeChange={
            articleTypes => history.push(toSearch({ ...query, page: 1, articleTypes }))
          }
        />

        <SelectSearchSortOrder
          sort={query.sort}
          onSortOrderChange={sort => history.push(toSearch({ ...query, sort, page: 1 }))}
        />

        <SearchResultList query={query} locale={locale} results={results} />

        <Pager
          page={query.page ? parseInt(query.page, 10) : 1}
          lastPage={lastPage}
          query={query}
          pathname={toSearch()}
        />
      </OneColumn>
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
  clearSearchResult: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  lastPage: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(ArticleResultShape).isRequired,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  search: actions.search,
  clearSearchResult: actions.clearSearchResult,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  results: getResults(state),
  lastPage: getLastPage(state),
  searching: getSearching(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
