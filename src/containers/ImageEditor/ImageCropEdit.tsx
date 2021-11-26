/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import config from '../../config';
import { ImageEmbed } from '../../interfaces';

interface Props {
  embed: ImageEmbed;
  onCropComplete: (crop: ReactCrop.Crop, pixelCrop: ReactCrop.PixelCrop) => void;
  transformData?: {
    'focal-x'?: string;
    'focal-y'?: string;
    'upper-left-x'?: string;
    'upper-left-y'?: string;
    'lower-right-x'?: string;
    'lower-right-y'?: string;
  };
}

const ImageCropEdit = ({ embed, onCropComplete, transformData }: Props) => {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
  const [crop, setCrop] = useState<ReactCrop.Crop | undefined>(
    transformData &&
      !!transformData['upper-left-x'] &&
      !!transformData['upper-left-y'] &&
      !!transformData['lower-right-x'] &&
      !!transformData['lower-right-y']
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
