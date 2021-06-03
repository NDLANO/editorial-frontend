/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';

import { searchSeries } from '../../modules/audio/audioApi';

import SearchContainer from './SearchContainer';

const SearchPodcastSeriesPage = ({ t }: tType) => {
  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.searchAudioPage')} />
      <SearchContainer type="podcast-series" searchFunction={searchSeries} />
    </>
  );
};

export default injectT(SearchPodcastSeriesPage);
