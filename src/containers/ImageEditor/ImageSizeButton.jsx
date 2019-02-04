/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { ImageNormal, ImageSmall, ImageXsmall } from '@ndla/icons/editor';
import ImageEditorButton from './ImageEditorButton';

const icon = {
  xsmall: <ImageXsmall />,
  small: <ImageSmall />,
  fullwidth: <ImageNormal />,
};

const ImageSizeButton = ({ currentSize, size, onFieldChange, t }) => (
  <Tooltip tooltip={t(`form.image.sizes.${size}`)}>
    <ImageEditorButton
      isActive={currentSize === size}
      tabIndex={-1}
      stripped
      onClick={evt => onFieldChange(evt, 'size', size)}
    >
    {icon[size]}
    </ImageEditorButton>
  </Tooltip>
);

ImageSizeButton.propTypes = {
  currentSize: PropTypes.string,
  size: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

ImageSizeButton.defaultProps = {
  currentSize: 'fullwidth',
};

export default injectT(ImageSizeButton);
