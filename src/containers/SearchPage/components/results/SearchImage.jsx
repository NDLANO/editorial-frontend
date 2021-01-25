/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { toEditImage } from '../../../../util/routeHelpers';
import { ImageResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

const SearchImage = ({ image, locale, t }) => (
  <div {...searchClasses('result')}>
    <div {...searchClasses('image')}>
      <img src={image.previewUrl} alt={image.altText} />
    </div>
    <div {...searchClasses('content')}>
      <Link to={toEditImage(image.id, image.title.language)}>
        <h1 {...searchClasses('title')}>{image.title.title || t('imageSearch.noTitle')}</h1>
      </Link>
    </div>
  </div>
);

SearchImage.propTypes = {
  image: ImageResultShape.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(SearchImage);
