/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { searchAudio } from '../../modules/audio/audioApi';
import SearchContainer from './SearchContainer';

const SearchAudioPage = ({ t }: tType) => (
  <>
    <HelmetWithTracker title={t('htmlTitles.searchAudioPage')} />
    <SearchContainer type="audio" searchFunction={searchAudio} />
  </>
);

export default injectT(SearchAudioPage);
