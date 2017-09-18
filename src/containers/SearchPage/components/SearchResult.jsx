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
} from '../../../shapes';
import SearchArticle from './SearchArticle';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';

const SearchResult = ({ item, resultType }) => {
  switch (resultType) {
    case 'articles':
      return <SearchArticle article={item} />;
    case 'images':
      return <SearchImage image={item} />;
    case 'audios':
      return <SearchAudio audio={item} />;
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
};

export default SearchResult;
