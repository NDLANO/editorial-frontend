/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { css } from '@emotion/core';
import { Embed } from '../../interfaces';
import ImageFocalPointEdit from './ImageFocalPointEdit';
import ImageCropEdit from './ImageCropEdit';
import { getSrcSets } from '../../util/imageEditorUtil';

const imgStyle = css`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

interface Props {
  embed: Embed;
  editType: string | undefined;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onCropComplete: (crop: ReactCrop.Crop, size: ReactCrop.PixelCrop) => void;
  transformData:
    | {
        'upper-left-x': string;
        'upper-left-y': string;
        'lower-right-x': string;
        'lower-right-y': string;
        'focal-x': string;
        'focal-y': string;
      }
    | undefined;
}

const ImageTransformEditor = ({
  embed,
  editType,
  onFocalPointChange,
  onCropComplete,
  transformData,
}: Props) => {
  switch (editType) {
    case 'focalPoint':
      return (
        <ImageFocalPointEdit
          embed={embed}
          transformData={transformData}
          onFocalPointChange={onFocalPointChange}
        />
      );
    case 'crop':
      return (
        <ImageCropEdit
          embed={embed}
          onCropComplete={onCropComplete}
          transformData={transformData}
        />
      );
    default:
      return (
        <figure>
          <img
            css={imgStyle}
            alt={embed.alt}
            srcSet={getSrcSets(embed.resource_id, transformData)}
          />
        </figure>
      );
  }
};

export default ImageTransformEditor;
