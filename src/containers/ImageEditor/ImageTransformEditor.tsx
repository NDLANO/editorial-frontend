/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Crop } from 'react-image-crop';
import styled from '@emotion/styled';
import ImageCropEdit from './ImageCropEdit';
import ImageFocalPointEdit from './ImageFocalPointEdit';
import { CropUnit, ImageEmbed } from '../../interfaces';
import { getSrcSets } from '../../util/imageEditorUtil';

const StyledImg = styled.img`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

interface Props {
  embed: ImageEmbed;
  language: string;
  editType?: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onCropComplete: (crop: Crop) => void;
  transformData?: {
    'focal-x'?: string;
    'focal-y'?: string;
    'upper-left-x'?: string;
    'upper-left-y'?: string;
    'lower-right-x'?: string;
    'lower-right-y'?: string;
    'crop-unit'?: CropUnit;
  };
  aspect?: number;
}

const ImageTransformEditor = ({
  embed,
  language,
  editType,
  onFocalPointChange,
  onCropComplete,
  transformData,
  aspect,
}: Props) => {
  switch (editType) {
    case 'focalPoint':
      return (
        <ImageFocalPointEdit
          embed={embed}
          language={language}
          transformData={transformData}
          onFocalPointChange={onFocalPointChange}
        />
      );
    case 'crop':
      return (
        <ImageCropEdit
          embed={embed}
          language={language}
          onCropComplete={onCropComplete}
          transformData={transformData}
          aspect={aspect}
        />
      );
    default:
      return (
        <figure>
          <StyledImg
            alt={embed.alt}
            srcSet={getSrcSets(embed.resource_id, transformData, language)}
          />
        </figure>
      );
  }
};

export default ImageTransformEditor;
