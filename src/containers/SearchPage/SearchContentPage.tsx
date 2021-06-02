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

import SearchContainer from './SearchContainer';
import * as searchApi from '../../modules/search/searchApi';

const SearchContentPage = ({ t }: tType) => (
  <Fragment>
    <HelmetWithTracker title={t('htmlTitles.searchContentPage')} />
    <SearchContainer type="content" searchFunction={searchApi.search} />
  </Fragment>
);

export default injectT(SearchContentPage);
