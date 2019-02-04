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
import { AlignLeft, AlignCenter, AlignRight } from '@ndla/icons/editor';
import ImageEditorButton from './ImageEditorButton';

const icon = {
  left: <AlignLeft />,
  right: <AlignRight />,
  center: <AlignCenter />,
};

const ImageAlignButton = ({ currentAlign, alignType, onFieldChange, t }) => {
  const onChange = evt => {
    onFieldChange(evt, 'align', alignType);
    if (alignType === 'center') {
      onFieldChange(evt, 'size', 'fullwidth');
    }
  };
  
  return (
    <Tooltip tooltip={t(`form.image.alignment.${alignType}`)}>
      <ImageEditorButton
        tabIndex={-1}
        isActive={currentAlign === alignType}
        stripped
        onClick={onChange}>
        {icon[alignType]}
      </ImageEditorButton>
    </Tooltip>
  );
};
ImageAlignButton.propTypes = {
  currentAlign: PropTypes.string.isRequired,
  alignType: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default injectT(ImageAlignButton);
