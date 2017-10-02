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
import { AlignLeft, AlignCenter, AlignRight } from 'ndla-ui/icons';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

const icon = {
  left: <AlignLeft />,
  right: <AlignRight />,
  center: <AlignCenter />,
};

const ImageAlignButton = ({ currentAlign, alignType, onAlignChange }) => (
  <Button
    {...classes(
      'align-image-button',
      currentAlign === alignType ? 'active' : '',
    )}
    stripped
    onClick={evt => onAlignChange(evt, alignType)}>
    {icon[alignType]}
  </Button>
);

ImageAlignButton.propTypes = {
  currentAlign: PropTypes.string.isRequired,
  alignType: PropTypes.string.isRequired,
  onAlignChange: PropTypes.func.isRequired,
};

export default ImageAlignButton;
