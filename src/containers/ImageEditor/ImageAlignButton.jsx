/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Button from 'ndla-button';
import { AlignLeft, AlignCenter, AlignRight } from 'ndla-icons/editor';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

const icon = {
  left: <AlignLeft />,
  right: <AlignRight />,
  center: <AlignCenter />,
};

const ImageAlignButton = ({ currentAlign, alignType, onFieldChange }) => {
  const onChange = evt => {
    onFieldChange(evt, 'align', alignType);
    if (alignType === 'center') {
      onFieldChange(evt, 'size', 'fullwidth');
    }
  };
  return (
    <Button
      {...classes(
        'align-image-button',
        currentAlign === alignType ? 'active' : '',
      )}
      stripped
      onClick={onChange}>
      {icon[alignType]}
    </Button>
  );
};
ImageAlignButton.propTypes = {
  currentAlign: PropTypes.string.isRequired,
  alignType: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default ImageAlignButton;
