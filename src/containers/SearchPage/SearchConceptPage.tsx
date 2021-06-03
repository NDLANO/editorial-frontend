/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import SearchContainer from './SearchContainer';
import { searchConcepts } from '../../modules/concept/conceptApi';

const SearchConceptPage = ({ t }: tType) => (
  <>
    <HelmetWithTracker title={t('htmlTitles.searchConceptPage')} />
    <SearchContainer type="concept" searchFunction={searchConcepts} />
  </>
);

export default injectT(SearchConceptPage);
