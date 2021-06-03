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
import { searchImages } from '../../modules/image/imageApi';

import SearchContainer from './SearchContainer';

const SearchImagePage = ({ t }: tType) => (
  <>
    <HelmetWithTracker title={t('htmlTitles.searchImagePage')} />
    <SearchContainer type="image" searchFunction={searchImages} />
  </>
);

export default injectT(SearchImagePage);
