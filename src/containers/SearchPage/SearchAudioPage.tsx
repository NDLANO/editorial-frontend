/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import * as audioApi from '../../modules/audio/audioApi';
import SearchContainer from './SearchContainer';

const SearchAudioPage = ({ t }: tType) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.searchAudioPage')} />
    <SearchContainer type="audio" searchFunction={audioApi.searchAudio} />
  </Fragment>
);

export default injectT(SearchAudioPage);
