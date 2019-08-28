/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import queryString from 'query-string';
import { injectT } from '@ndla/i18n';
import { OneColumn } from '@ndla/ui';
import Pager from '@ndla/pager';
import { Search } from '@ndla/icons/common';
import debounce from 'lodash/debounce';
import BEMHelper from 'react-bem-helper';
import { getLocale } from '../../modules/locale/locale';
import { getSearching } from '../../modules/search/searchSelectors';
import { SearchResultShape, HistoryShape, LocationShape } from '../../shapes';
import SearchList from './components/results/SearchList';
import SearchListOptions from './components/results/SearchListOptions';
import SearchForm from './components/form/SearchForm';
import SearchSort from './components/sort/SearchSort';
import { toSearch } from '../../util/routeHelpers';

export const searchClasses = new BEMHelper({
  name: 'search',
  prefix: 'c-',
});

class SearchContainer extends Component {
  constructor() {
    super();
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.onQueryPush = debounce(this.onQueryPush.bind(this), 300);
  }

  componentDidMount() {
    const { location, search, type } = this.props;
    if (location.search) {
      const searchObject = queryString.parse(location.search);
      search({ query: searchObject, type });
    }
  }

  onQueryPush(newSearchObject) {
    const { location, history, type, search } = this.props;
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(
      key => searchQuery[key] === '' && delete searchQuery[key],
    );
    search({ query: searchQuery, type });
    history.push(toSearch(searchQuery, type));
  }

  onSortOrderChange(sort) {
    this.onQueryPush({ sort, page: 1 });
  }

  render() {
    const {
      location,
      searching,
      results,
      locale,
      lastPage,
      totalCount,
      type,
      t,
    } = this.props;
    const searchObject = queryString.parse(location.search);
    return (
      <OneColumn>
        <h2>
          <Search className="c-icon--medium" />
          {t(`searchPage.header.${type}`)}
        </h2>
        <SearchForm
          type={type}
          search={this.onQueryPush}
          searchObject={searchObject}
          location={location}
          locale={locale}
        />
        {type === 'content' && (
          <SearchSort
            location={location}
            onSortOrderChange={this.onSortOrderChange}
          />
        )}
        <SearchListOptions
          type={type}
          searchObject={searchObject}
          totalCount={totalCount}
          search={this.onQueryPush}
        />
        <SearchList
          searchObject={searchObject}
          results={results.results}
          searching={searching}
          type={type}
          locale={locale}
        />
        <Pager
          page={searchObject.page ? parseInt(searchObject.page, 10) : 1}
          lastPage={lastPage}
          query={searchObject}
          onClick={this.onQueryPush}
        />
      </OneColumn>
    );
  }
}

SearchContainer.propTypes = {
  location: LocationShape,
  history: HistoryShape,
  locale: PropTypes.string.isRequired,
  lastPage: PropTypes.number.isRequired,
  results: SearchResultShape,
  totalCount: PropTypes.number,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  searching: getSearching(state),
});

export default compose(
  connect(mapStateToProps),
  injectT,
)(SearchContainer);
