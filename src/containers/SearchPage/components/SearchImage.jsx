/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { toEditImage } from '../../../util/routeHelpers';
import { ImageResultShape } from '../../../shapes';
import { searchClasses } from '../SearchPage';

const SearchImage = ({ image }) => (
  <div {...searchClasses('result')}>
    <div {...searchClasses('content')}>
      <Link to={toEditImage(image.id)}>
        <h1 {...searchClasses('title')}>{image.title}</h1>
      </Link>
    </div>
    <div {...searchClasses('image')}>
      <img src={image.previewUrl} alt={image.altText} />
    </div>
  </div>
);

SearchImage.propTypes = {
  image: ImageResultShape.isRequired,
};

export default SearchImage;
