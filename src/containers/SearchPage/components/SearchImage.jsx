/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { ArticleResultShape } from '../../../shapes';

const SearchImage = ({ image }) =>
  <div className="search-result">
    <h1 className="search-result__title">
      {image.title}
    </h1>
    <img src={image.previewUrl} alt={image.altText} />
  </div>;

SearchImage.propTypes = {
  image: ArticleResultShape.isRequired,
};

export default SearchImage;
