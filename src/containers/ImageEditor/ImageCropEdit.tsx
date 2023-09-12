/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import { ImageEmbedData } from '@ndla/types-embed';
import config from '../../config';
import { TransformData } from '../../util/imageEditorUtil';

interface Props {
  embed: ImageEmbedData;
  language: string;
  onCropComplete: (crop: ReactCrop.Crop, pixelCrop: ReactCrop.PixelCrop) => void;
  transformData?: TransformData;
}

const ImageCropEdit = ({ embed, language, onCropComplete, transformData }: Props) => {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resourceId}?language=${language}`;
  const [crop, setCrop] = useState<ReactCrop.Crop | undefined>(
    transformData &&
      !!transformData.upperLeftX &&
      !!transformData.upperLeftY &&
      !!transformData.lowerRightX &&
      !!transformData.lowerRightY
      ? {
          x: parseInt(transformData!.upperLeftX),
          y: parseInt(transformData!.upperLeftY),
          width: parseInt(transformData!.lowerRightX) - parseInt(transformData!.upperLeftX),
          height: parseInt(transformData!.lowerRightY) - parseInt(transformData!.upperLeftY),
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
      onChange={(crop) => setCrop(crop)}
    />
  );
};

export default ImageCropEdit;
