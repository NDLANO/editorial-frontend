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
  getPodcastSeriesResults,
  getPodcastSeriesTotalResultsCount,
  getPodcastSeriesLastPage,
} from '../../modules/search/searchSelectors';

import SearchContainer from './SearchContainer';

const SearchAudioPage = ({ t, ...props }) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.searchAudioPage')} />
    <SearchContainer type="podcast-series" {...props} />
  </Fragment>
);

const mapStateToProps = (state, ownProps) => ({
  results: getPodcastSeriesResults(state, queryString.parse(ownProps.location.search)),
  totalCount: getPodcastSeriesTotalResultsCount(state),
  lastPage: getPodcastSeriesLastPage(state),
});

const mapDispatchToProps = {
  search: actions.searchPodcastSeries,
  clearSearch: actions.clearSearchResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectT(SearchAudioPage));
