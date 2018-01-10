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
import { toSearch } from '../../util/routeHelpers';

class MastheadSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: undefined,
    };
  }

  componentWillMount() {
    const { location } = this.props;
    if (location.search) {
      const query = queryString.parse(location.search);
      this.setState({
        query: query.query,
      });
    }
  }

  render() {
    const { history, searching, location } = this.props;
    const { query } = this.state;
    const locationQuery = queryString.parse(location.search);
    let articleTypes;
    if (locationQuery.types === 'articles') {
      articleTypes = locationQuery.articleTypes
        ? locationQuery.articleTypes
        : 'standard';
    }

    return (
      <div className="masthead-search">
        <MastheadSearchForm
          query={query}
          searching={searching}
          onSearchQuerySubmit={searchQuery =>
            history.push(
              toSearch({
                query: searchQuery,
                page: 1,
                types: locationQuery.types
                  ? locationQuery.types
                  : ['articles', 'images', 'audios'].join(','),
                articleTypes,
              }),
            )
          }
        />
      </div>
    );
  }
}

MastheadSearch.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  searching: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  searching: getSearching(state),
});

export default withRouter(connect(mapStateToProps)(MastheadSearch));
