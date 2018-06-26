/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import * as actions from '../../modules/search/search';
import {
  getDraftResults,
  getDraftLastPage,
  getDraftTotalResultsCount,
} from '../../modules/search/searchSelectors';

import SearchContainer from './SearchContainer';

const SearchMediaPage = props => <SearchContainer type="media" {...props} />;

const mapStateToProps = (state, ownProps) => ({
  results: getDraftResults(
    state,
    queryString.parse(ownProps.location.search).types,
  ),
  totalCount: getDraftTotalResultsCount(state),
  lastPage: getDraftLastPage(state),
});

const mapDispatchToProps = {
  search: actions.searchDraft,
  clearSearch: actions.clearSearchResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMediaPage);
