/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react'
import { injectT } from '@ndla/i18n';
import { searchClasses } from '../../SearchContainer';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';

const SearchConcept = ({concept, t}) => {
  const title = convertFieldWithFallback(concept, 'title', concept.title)
  const content = convertFieldWithFallback(concept, 'content', concept.content)
  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('content')}>
        <h1 {...searchClasses('title')}>
          <u>{title || t('conceptSearch.noTitle')}</u>
        </h1>
        <p>{content || t('conceptSearch.noTitle')}</p>
      </div>
    </div>
  )
}

export default injectT(SearchConcept);