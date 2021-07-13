/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { ImageNormal, ImageSmall, ImageXsmall, ImageXxSmall } from '@ndla/icons/editor';
import ImageEditorButton from './ImageEditorButton';

const icon: Record<string, JSX.Element> = {
  xsmall: <ImageXxSmall />,
  small: <ImageXsmall />,
  medium: <ImageSmall />,
  fullwidth: <ImageNormal />,
};

interface Props {
  size: string;
  onFieldChange: (evt: MouseEvent, field: string, value: string) => void;
  currentSize: string;
}

const ImageSizeButton = ({ currentSize = 'fullwidth', size, onFieldChange, t }: Props & tType) => (
  <Tooltip tooltip={t(`form.image.sizes.${size}`)}>
    <ImageEditorButton
      isActive={currentSize.startsWith(size)}
      tabIndex={-1}
      stripped
      onClick={evt => onFieldChange(evt, 'size', size)}>
      {icon[size]}
    </ImageEditorButton>
  </Tooltip>
);

export default injectT(ImageSizeButton);
