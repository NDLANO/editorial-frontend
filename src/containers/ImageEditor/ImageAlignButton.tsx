/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { AlignLeft, AlignCenter, AlignRight } from '@ndla/icons/editor';
import ImageEditorButton from './ImageEditorButton';

const icon: Record<string, JSX.Element> = {
  left: <AlignLeft />,
  right: <AlignRight />,
  center: <AlignCenter />,
};

interface Props {
  currentAlign?: string;
  alignType: string;
  onFieldChange: (evt: MouseEvent, field: string, value: string) => void;
}

const ImageAlignButton = ({ currentAlign, alignType, onFieldChange, t }: Props & tType) => {
  const onChange = (evt: MouseEvent) => {
    onFieldChange(evt, 'align', alignType);
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

export default injectT(ImageAlignButton);
