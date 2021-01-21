/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import * as actions from '../../modules/search/search';
import {
  getAudioResults,
  getAudioLastPage,
  getAudioTotalResultsCount,
} from '../../modules/search/searchSelectors';

import SearchContainer from './SearchContainer';

const SearchAudioPage = ({ t, ...props }) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.searchAudioPage')} />
    <SearchContainer type="audio" {...props} />
  </Fragment>
);

const mapStateToProps = (state, ownProps) => ({
  results: getAudioResults(
    state,
    queryString.parse(ownProps.location.search).types,
  ),
  totalCount: getAudioTotalResultsCount(state),
  lastPage: getAudioLastPage(state),
});

const mapDispatchToProps = {
  search: actions.searchAudio,
  clearSearch: actions.clearSearchResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectT(SearchAudioPage));
