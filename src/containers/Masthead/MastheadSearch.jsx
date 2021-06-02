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
import { withRouter } from 'react-router-dom';
import MastheadSearchForm from './components/MastheadSearchForm';
import { toSearch } from '../../util/routeHelpers';
import { HistoryShape, LocationShape } from '../../shapes';
import { LocaleContext } from '../App/App';
import { SearchTypeValues } from '../SearchPage/interfaces';

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

  onSearchQuerySubmit = (searchQuery, locale) => {
    const { location, history, close } = this.props;

    const type =
      location.pathname.split('/').find(pathValue => SearchTypeValues.includes(pathValue)) ||
      'content';

    history.push(
      toSearch(
        {
          query: searchQuery,
          page: 1,
          sort: '-lastUpdated',
          'page-size': 10,
          language: locale,
          fallback: true,
        },
        type,
      ),
    );

    close();
  };

  render() {
    return (
      <LocaleContext.Consumer>
        {locale => (
          <MastheadSearchForm
            query={this.state.query}
            onSearchQuerySubmit={searchQuery => this.onSearchQuerySubmit(searchQuery, locale)}
          />
        )}
      </LocaleContext.Consumer>
    );
  }
}

MastheadSearch.propTypes = {
  location: LocationShape,
  history: HistoryShape,
  close: PropTypes.func,
};

export default withRouter(MastheadSearch);
