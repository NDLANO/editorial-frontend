/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MastheadSearchForm from './components/MastheadSearchForm';
import * as actions from '../../modules/search/search';
import { getSearching } from '../../modules/search/searchSelectors';
import { toSearch } from '../../util/routeHelpers';
import { HistoryShape, LocationShape } from '../../shapes';

const validSearchPaths = ['/search/content', '/search/concept', '/search/image', '/search/audio'];

class MastheadSearch extends Component {
  static getDerivedStateFromProps(props, state) {
    const { location } = props;
    const { query } = state;
    const propsQuery = queryString.parse(location.search).query;
    if (query !== propsQuery) {
      return { query: propsQuery };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      query: undefined,
    };
  }

  onSearchQuerySubmit = searchQuery => {
    const { history, location, close, search } = this.props;

    if (validSearchPaths.includes(location.pathname)) {
      const type = location.pathname.replace('/search/', '');
      const searchObject = queryString.parse(location.search);
      searchObject.query = searchQuery;

      search({ query: searchObject, type });
      history.push(toSearch(searchObject, type));
    } else {
      history.push(
        toSearch({
          query: searchQuery,
          page: 1,
          sort: '-lastUpdated',
          'page-size': 10,
        }),
      );
    }

    close();
  };

  render() {
    const { searching } = this.props;
    const { query } = this.state;
    return (
      <MastheadSearchForm
        query={query}
        searching={searching}
        onSearchQuerySubmit={this.onSearchQuerySubmit}
      />
    );
  }
}

MastheadSearch.propTypes = {
  location: LocationShape,
  searching: PropTypes.bool.isRequired,
  history: HistoryShape,
  close: PropTypes.func,
  search: PropTypes.func,
};

const mapStateToProps = state => ({
  searching: getSearching(state),
});

const mapDispatchToProps = {
  search: actions.search,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MastheadSearch));
