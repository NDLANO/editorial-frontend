/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { ImageEmbedData } from '@ndla/types-embed';
import ImageFocalPointEdit from './ImageFocalPointEdit';
import ImageCropEdit from './ImageCropEdit';
import { TransformData, getSrcSets } from '../../util/imageEditorUtil';

const StyledImg = styled.img`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

interface Props {
  embed: ImageEmbedData;
  language: string;
  editType?: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onCropComplete: (crop: ReactCrop.Crop, size: ReactCrop.PixelCrop) => void;
  transformData?: TransformData;
}

const ImageTransformEditor = ({
  embed,
  language,
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
        />
      );
    default:
      return (
        <figure>
          <StyledImg
            alt={embed.alt}
            srcSet={getSrcSets(embed.resourceId, transformData, language)}
          />
        </figure>
      );
  }
};

export default ImageTransformEditor;
