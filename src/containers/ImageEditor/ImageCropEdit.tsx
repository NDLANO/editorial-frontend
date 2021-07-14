/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import config from '../../config';
import { Embed } from '../../interfaces';

interface Props {
  embed: Embed;
  onCropComplete: (crop: ReactCrop.Crop, pixelCrop: ReactCrop.PixelCrop) => void;
  transformData?: {
    'focal-x': string;
    'focal-y': string;
    'upper-left-x': string;
    'upper-left-y': string;
    'lower-right-x': string;
    'lower-right-y': string;
  };
}

const ImageCropEdit = ({ embed, onCropComplete, transformData }: Props) => {
  let embedHasCrop: boolean = false;
  if (transformData) {
    embedHasCrop =
      transformData['upper-left-x'] !== undefined &&
      transformData['upper-left-y'] !== undefined &&
      transformData['lower-right-x'] !== undefined &&
      transformData['lower-right-y'] !== undefined;
  }

  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
  const [crop, setCrop] = useState<ReactCrop.Crop | undefined>(
    embedHasCrop
      ? {
          x: parseInt(transformData!['upper-left-x']),
          y: parseInt(transformData!['upper-left-y']),
          width:
            parseInt(transformData!['lower-right-x']) - parseInt(transformData!['upper-left-x']),
          height:
            parseInt(transformData!['lower-right-y']) - parseInt(transformData!['upper-left-y']),
        }
      : undefined,
  );

  return (
    <ReactCrop
      style={{ minWidth: '100%' }}
      imageStyle={{ minWidth: '100%' }}
      src={src}
      onComplete={onCropComplete}
      crop={crop}
      onChange={crop => setCrop(crop)}
    />
  );
};

export default ImageCropEdit;
