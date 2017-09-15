/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { ArticleResultShape } from '../../../shapes';
import { searchClasses } from '../SearchPage';

const SearchImage = ({ image }) =>
  <div {...searchClasses()}>
    <h1 {...searchClasses('title')}>
      {image.title}
    </h1>
    <img src={image.previewUrl} alt={image.altText} />
  </div>;

SearchImage.propTypes = {
  image: ArticleResultShape.isRequired,
};

export default SearchImage;
