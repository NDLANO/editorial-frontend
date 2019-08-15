/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import {
  ContentResultShape,
  ImageResultShape,
  AudioResultShape,
} from '../../../../shapes';
import SearchContent from './SearchContent';
import SearchConcept from './SearchConcept';
import SearchAgreement from './SearchAgreement';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';

const SearchResult = ({ result, locale, type, t }) => {
  switch (type) {
    case 'content':
      return <SearchContent content={result} locale={locale} />;
    case 'concept':
      return <SearchConcept concept={result} locale={locale} />;
    case 'agreement':
      return <SearchAgreement agreement={result} />;
    case 'media':
      switch (result.type) {
        case 'images':
          return <SearchImage image={result} locale={locale} />;
        case 'audios':
          return <SearchAudio audio={result} locale={locale} />;
        default:
          return <p>{t('searchForm.resultError', { type: result.type })}</p>;
      }
    default:
      return <p>{t('searchForm.resultError', { type })}</p>;
  }
};

SearchResult.propTypes = {
  result: PropTypes.oneOfType([
    ContentResultShape,
    ImageResultShape,
    AudioResultShape,
  ]),
  type: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(SearchResult);
