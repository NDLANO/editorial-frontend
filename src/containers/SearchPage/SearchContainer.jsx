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
import { injectT } from 'ndla-i18n';
import { OneColumn, Pager } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { getLocale } from '../../modules/locale/locale';
import { getSearching } from '../../modules/search/searchSelectors';
import SearchAccordion from './components/SearchAccordion';
import { SearchResultShape } from '../../shapes';
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
    this.state = { hiddenContent: false };
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.onQueryPush = this.onQueryPush.bind(this);
    this.toggleContent = this.toggleContent.bind(this);
  }

  componentWillMount() {
    const { location, search } = this.props;
    if (location.search) {
      const query = queryString.parse(location.search);
      search(query);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, search } = nextProps;
    if (location.search && location.search !== this.props.location.search) {
      const query = queryString.parse(location.search);
      search(query);
    }
  }

  onQueryPush(newQuery) {
    const { history, location, type } = this.props;
    const oldQuery = queryString.parse(location.search);

    const searchQuery = {
      ...oldQuery,
      ...newQuery,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(
      key => searchQuery[key] === '' && delete searchQuery[key],
    );

    history.push(toSearch({ ...searchQuery }, type));
  }

  onSortOrderChange(sort) {
    this.onQueryPush({ sort, page: 1 });
  }

  toggleContent() {
    this.setState(prevState => ({ hiddenContent: !prevState.hiddenContent }));
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

    const query = queryString.parse(location.search);
    return (
      <div>
        <OneColumn>
          <SearchAccordion
            handleToggle={this.toggleContent}
            header={t(`searchPage.header.${type}`)}
            hidden={this.state.hiddenContent}>
            <SearchForm
              type={type}
              search={this.onQueryPush}
              query={query}
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
              query={query}
              totalCount={totalCount}
              search={this.onQueryPush}
            />
          </SearchAccordion>
          <SearchList
            query={query.query}
            locale={locale}
            results={results.results}
            searching={searching}
            type={type}
          />
          <Pager
            page={query.page ? parseInt(query.page, 10) : 1}
            lastPage={lastPage}
            query={query}
            pathname={toSearch(null, type)}
          />
        </OneColumn>
      </div>
    );
  }
}

SearchContainer.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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

export default compose(connect(mapStateToProps, null), injectT)(
  SearchContainer,
);
