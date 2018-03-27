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
import SearchArticle from './SearchArticle';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';

const SearchResult = ({ item, locale, resultType }) => {
  switch (resultType) {
    case 'articles':
      return <SearchArticle article={item} locale={locale} />;
    case 'images':
      return <SearchImage image={item} locale={locale} />;
    case 'audios':
      return <SearchAudio audio={item} locale={locale} />;
    default:
      return <p>{`Something went wrong with ${resultType}`}</p>;
  }
};

SearchResult.propTypes = {
  item: PropTypes.oneOfType([
    ArticleResultShape,
    ImageResultShape,
    AudioResultShape,
  ]),
  resultType: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default SearchResult;
