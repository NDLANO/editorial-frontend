/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import config from '../../config';
import { CropUnit, ImageEmbed } from '../../interfaces';

interface Props {
  embed: ImageEmbed;
  language: string;
  onCropComplete: (crop: Crop) => void;
  transformData?: {
    'upper-left-x'?: string;
    'upper-left-y'?: string;
    'lower-right-x'?: string;
    'lower-right-y'?: string;
    'crop-unit'?: CropUnit;
  };
  aspect?: number;
}

const ImageCropEdit = ({ embed, language, onCropComplete, transformData, aspect }: Props) => {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}?language=${language}`;
  const unit = (cropUnit?: CropUnit) => (cropUnit === 'pixel' ? 'px' : '%');
  const [crop, setCrop] = useState<Crop | undefined>(
    transformData &&
      !!transformData['upper-left-x'] &&
      !!transformData['upper-left-y'] &&
      !!transformData['lower-right-x'] &&
      !!transformData['lower-right-y'] &&
      !!transformData['crop-unit']
      ? {
          unit: unit(transformData!['crop-unit']),
          x: parseInt(transformData!['upper-left-x']),
          y: parseInt(transformData!['upper-left-y']),
          width:
            parseInt(transformData!['lower-right-x']) - parseInt(transformData!['upper-left-x']),
          height:
            parseInt(transformData!['lower-right-y']) - parseInt(transformData!['upper-left-y']),
        }
      : undefined,
  );

  const onComplete = (crop: Crop) => {
    if (crop.width === 0 && crop.height === 0) {
      return;
    }
    onCropComplete(crop);
  };

  return (
    <ReactCrop
      style={{ minWidth: '100%' }}
      onComplete={(crop, _) => onComplete(crop)}
      crop={crop}
      aspect={aspect}
      onChange={(_, crop) => setCrop(crop)}
      ruleOfThirds
    >
      <img src={src} alt="" />
    </ReactCrop>
  );
};

export default ImageCropEdit;
