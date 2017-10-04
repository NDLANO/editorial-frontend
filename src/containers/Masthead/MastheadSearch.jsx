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
import { SiteNav, SiteNavItem } from 'ndla-ui';
import { Search, Cross } from 'ndla-ui/icons';
import { withRouter } from 'react-router-dom';

import MastheadSearchForm from './components/MastheadSearchForm';
import { getSearching } from './mastheadSelectors';
import { toSearch } from '../../util/routeHelpers';

class MastheadSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: undefined,
      showSearchField: false,
    };
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;
    if (location.search) {
      const query = queryString.parse(location.search);
      this.setState({
        query: query.query,
        showSearchField: !!query.query || location.pathname === '/search',
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.pathname && location.pathname !== '/search') {
      this.setState({ showSearchField: false });
    } else if (location.pathname && location.pathname === '/search') {
      this.setState({ showSearchField: true });
    }
  }

  handleSearchIconClick() {
    this.setState(prevState => ({
      showSearchField: !prevState.showSearchField,
    }));
  }

  render() {
    const { history, searching, location } = this.props;
    const { showSearchField, query } = this.state;
    const locationQuery = queryString.parse(location.search);
    let articleTypes;
    if (locationQuery.types === 'articles' || !location.types) {
      articleTypes = locationQuery.articleTypes
        ? locationQuery.articleTypes
        : 'topic-article';
    }
    return (
      <div className="masthead-search">
        <SiteNav>
          {!showSearchField && (
            <SiteNavItem onClick={this.handleSearchIconClick}>
              <div className="c-topic-menu__search">
                <div className="c-topic-menu__search-icon">
                  <Search className="c-icon--medium" />
                </div>
              </div>
            </SiteNavItem>
          )}
          {showSearchField && (
            <SiteNavItem onClick={this.handleSearchIconClick}>
              <div className="c-topic-menu__search">
                <div className="c-topic-menu__search-icon">
                  <Cross className="c-icon--medium" />
                </div>
              </div>
            </SiteNavItem>
          )}
        </SiteNav>
        <MastheadSearchForm
          query={query}
          show={showSearchField}
          searching={searching}
          onSearchQuerySubmit={searchQuery =>
            history.push(
              toSearch({
                query: searchQuery,
                page: 1,
                sort: '-relevance',
                types: locationQuery.types ? locationQuery.types : 'articles',
                articleTypes,
              }),
            )}
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
