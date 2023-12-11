/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageNormal, ImageSmall, ImageXsmall, ImageXxSmall } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import ImageEditorButton from './ImageEditorButton';

const icon: Record<string, JSX.Element> = {
  xsmall: <ImageXxSmall />,
  small: <ImageXsmall />,
  medium: <ImageSmall />,
  fullwidth: <ImageNormal />,
};

interface Props {
  size: string;
  onFieldChange: (evt: MouseEvent<HTMLButtonElement>, field: string, value: string) => void;
  currentSize?: string;
}

const ImageSizeButton = ({ currentSize = 'fullwidth', size, onFieldChange }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip tooltip={t(`form.image.sizes.${size}`)}>
      <ImageEditorButton
        isActive={currentSize.startsWith(size)}
        tabIndex={-1}
        onClick={(evt) => onFieldChange(evt, 'size', size)}
      >
        {icon[size]}
      </ImageEditorButton>
    </Tooltip>
  );
};

export default ImageSizeButton;
