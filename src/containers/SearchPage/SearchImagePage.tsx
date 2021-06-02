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
import * as imageApi from '../../modules/image/imageApi';

import SearchContainer from './SearchContainer';

const SearchImagePage = ({ t }: tType) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.searchImagePage')} />
    <SearchContainer type="image" searchFunction={imageApi.searchImages} />
  </Fragment>
);

export default injectT(SearchImagePage);
