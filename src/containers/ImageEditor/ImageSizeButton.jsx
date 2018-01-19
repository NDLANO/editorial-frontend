/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { ImageNormal, ImageSmall, ImageXsmall } from 'ndla-icons/editor';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

const icon = {
  xsmall: <ImageXsmall />,
  small: <ImageSmall />,
  fullwidth: <ImageNormal />,
};

const ImageSizeButton = ({ currentSize, size, onFieldChange }) => (
  <Button
    {...classes('align-image-button', currentSize === size ? 'active' : '')}
    stripped
    onClick={evt => onFieldChange(evt, 'size', size)}>
    {icon[size]}
  </Button>
);

ImageSizeButton.propTypes = {
  currentSize: PropTypes.string,
  size: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

ImageSizeButton.defaultProps = {
  currentSize: 'fullwidth',
};

export default ImageSizeButton;
