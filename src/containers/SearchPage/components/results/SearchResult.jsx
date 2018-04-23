/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  ArticleResultShape,
  ImageResultShape,
  AudioResultShape,
} from '../../../../shapes';
import SearchContent from './SearchContent';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';

const SearchResult = ({ result, locale, type }) => {
  switch (type) {
    case 'content':
      return <SearchContent content={result} locale={locale} />;
    case 'images':
      return <SearchImage image={result} locale={locale} />;
    case 'audios':
      return <SearchAudio audio={result} locale={locale} />;
    default:
      return <p>{`Something went wrong with ${type}`}</p>;
  }
};

SearchResult.propTypes = {
  result: PropTypes.oneOfType([
    ArticleResultShape,
    ImageResultShape,
    AudioResultShape,
  ]),
  type: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default SearchResult;
