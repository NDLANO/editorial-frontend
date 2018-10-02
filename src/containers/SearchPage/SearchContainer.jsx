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

  componentDidMount() {
    const { location, search } = this.props;
    if (location.search) {
      const searchObject = queryString.parse(location.search);
      search(searchObject);
    }
  }

  componentDidUpdate({ location: prevLocation }) {
    const { location, search } = this.props;
    if (location.search && location.search !== prevLocation.search) {
      const searchObject = queryString.parse(location.search);
      search(searchObject);
    }
  }

  onQueryPush(newSearchObject) {
    const { history, location, type } = this.props;
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
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

    const searchObject = queryString.parse(location.search);
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
          </SearchAccordion>
          <SearchList
            query={searchObject.query}
            locale={searchObject.language || locale}
            results={results.results}
            searching={searching}
            type={type}
          />
          <Pager
            page={searchObject.page ? parseInt(searchObject.page, 10) : 1}
            lastPage={lastPage}
            query={searchObject}
            pathname={toSearch(undefined, type)}
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

export default compose(
  connect(mapStateToProps),
  injectT,
)(SearchContainer);
