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
import { getSearching } from '../../modules/search/searchSelectors';
import { getLocale } from '../../modules/locale/locale';
import { toSearch } from '../../util/routeHelpers';
import { HistoryShape, LocationShape } from '../../shapes';

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

  render() {
    const { history, searching, close, locale } = this.props;
    const { query } = this.state;
    return (
      <MastheadSearchForm
        query={query}
        searching={searching}
        onSearchQuerySubmit={searchQuery => {
          history.push(
            toSearch({
              query: searchQuery,
              page: 1,
              sort: '-lastUpdated',
              'page-size': 10,
              language: locale,
              fallback: true,
            }),
          );
          close();
        }}
      />
    );
  }
}

MastheadSearch.propTypes = {
  location: LocationShape,
  searching: PropTypes.bool.isRequired,
  history: HistoryShape,
  close: PropTypes.func,
  locale: PropTypes.string,
};

const mapStateToProps = state => ({
  searching: getSearching(state),
  locale: getLocale(state),
});

export default withRouter(connect(mapStateToProps)(MastheadSearch));
