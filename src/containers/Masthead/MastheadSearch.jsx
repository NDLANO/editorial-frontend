/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      showSearchField: false,
    };
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
  }

  handleSearchIconClick() {
    this.setState(prevState => ({
      showSearchField: !prevState.showSearchField,
    }));
  }

  render() {
    const { history, searching } = this.props;
    const { showSearchField } = this.state;

    return (
      <div className="masthead-search">
        <SiteNav>
          {!showSearchField &&
            <SiteNavItem onClick={this.handleSearchIconClick}>
              <div className="c-topic-menu__search">
                <div className="c-topic-menu__search-icon">
                  <Search />
                </div>
              </div>
            </SiteNavItem>}
          {showSearchField &&
            <SiteNavItem onClick={this.handleSearchIconClick}>
              <div className="c-topic-menu__search">
                <div className="c-topic-menu__search-icon">
                  <Cross />
                </div>
              </div>
            </SiteNavItem>}
        </SiteNav>
        {showSearchField &&
          <MastheadSearchForm
            searching={searching}
            onSearchQuerySubmit={searchQuery =>
              history.push(
                toSearch({
                  query: searchQuery,
                  page: 1,
                  sort: '-relevance',
                }),
              )}
          />}
      </div>
    );
  }
}

MastheadSearch.propTypes = {
  searching: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  searching: getSearching(state),
});

export default withRouter(connect(mapStateToProps)(MastheadSearch));
