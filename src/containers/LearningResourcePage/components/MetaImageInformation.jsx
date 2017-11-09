/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { classes } from './LearningResourceForm';

const MetaImageInformation = ({ image, toggleImageSearchLightBox, t }) => {
  const copyright =
    image.copyright && image.copyright.authors
      ? image.copyright.authors.map(author => author.name).join(', ')
      : undefined;
  const title = convertFieldWithFallback(image, 'title', '');
  const alt = convertFieldWithFallback(image, 'alttext', '');

  return (
    <div {...classes('meta-image')}>
      <img src={image.imageUrl} alt={alt} />
      <div {...classes('meta-image-information')}>
        <strong>
          {title ? t('learningResourceForm.metaImage.title') : ''}
        </strong>
        <span>{title}</span>
        <strong>
          {copyright ? t('learningResourceForm.metaImage.copyright') : ''}
        </strong>
        <span>{copyright}</span>
        <Button onClick={toggleImageSearchLightBox}>
          {t('learningResourceForm.metaImage.change')}
        </Button>
      </div>
    </div>
  );
};

MetaImageInformation.propTypes = {
  image: PropTypes.shape({}),
  locale: PropTypes.string.isRequired,
  toggleImageSearchLightBox: PropTypes.func.isRequired,
};

export default injectT(MetaImageInformation);
