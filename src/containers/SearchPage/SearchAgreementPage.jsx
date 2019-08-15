/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import * as actions from '../../modules/search/search';
import {
  getResults,
  getLastPage,
  getTotalResultsCount,
} from '../../modules/search/searchSelectors';

import SearchContainer from './SearchContainer';

const SearchAgreementPage = ({ t, ...props }) => (
  <>
    <HelmetWithTracker title={t('htmlTitles.searchAgreementPage')} />
    <SearchContainer type="agreement" {...props} />
  </>
);

const mapStateToProps = (state, ownProps) => ({
  results: getResults(state, queryString.parse(ownProps.location.search).types),
  totalCount: getTotalResultsCount(state),
  lastPage: getLastPage(state),
});

const mapDispatchToProps = {
  search: actions.search,
  clearSearch: actions.clearSearchResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectT(SearchAgreementPage));
