/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useState } from 'react';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ButtonV2 } from '@ndla/button';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { Crop, FocalPoint } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { ImageEmbedData } from '@ndla/types-embed';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';
import ImageSizeButton from './ImageSizeButton';
import ImageEditorButton from './ImageEditorButton';
import ShowBylineButton from './ShowBylineButton';
import { ImageUpdates } from '../../components/SlateEditor/plugins/image/EditImage';
import { TransformData } from '../../util/imageEditorUtil';

const StyledImageEditorMenu = styled('div')`
  color: white;
  background-color: black;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const StyledImageEditorEditMode = styled('div')`
  position: relative;
  z-index: 99;
  background-color: ${colors.brand.grey};
`;

const alignments = ['left', 'center', 'right'];

const sizes = ['xsmall', 'small', 'medium'];

const bylineOptions = ['hide', 'show'];

const defaultData: Record<string, TransformData> = {
  focalPoint: {
    focalX: undefined,
    focalY: undefined,
  },
  crop: {
    upperLeftX: undefined,
    upperLeftY: undefined,
    lowerRightX: undefined,
    lowerRightY: undefined,
    focalX: undefined,
    focalY: undefined,
  },
} as const;

interface Props {
  embed: ImageEmbedData;
  onUpdatedImageSettings: Function;
  imageUpdates: ImageUpdates | undefined;
  language: string;
  image: IImageMetaInformationV3;
}

type StateProp = 'crop' | 'focalPoint' | undefined;

const ImageEditor = ({ embed, onUpdatedImageSettings, image, imageUpdates, language }: Props) => {
  const { t } = useTranslation();
  const [editType, setEditType] = useState<StateProp>(undefined);

  const onFocalPointChange = (focalPoint: { x: number; y: number }) => {
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates?.transformData,
        focalX: focalPoint.x.toString(),
        focalY: focalPoint.y.toString(),
      },
    });
  };

  const onCropComplete = (crop: ReactCrop.Crop, size: ReactCrop.PixelCrop) => {
    const width = crop.width ?? 0;
    const height = crop.height ?? 0;
    if (size.width === 0) {
      setEditType(undefined);
      onUpdatedImageSettings({ transformData: defaultData.crop });
    } else {
      onUpdatedImageSettings({
        transformData: {
          upperLeftX: crop.x.toString(),
          upperLeftY: crop.y.toString(),
          lowerRightX: (crop.x + width).toString(),
          lowerRightY: (crop.y + height).toString(),
          ...defaultData.focalPoint,
        },
      });
    }
  };

  const onFieldChange = (evt: MouseEvent<HTMLButtonElement>, field: string, value: string) => {
    evt.stopPropagation();
    onUpdatedImageSettings({ [field]: value });
  };

  const onEditorTypeSet = (evt: MouseEvent<HTMLButtonElement>, type: StateProp) => {
    setEditType(type);
  };

  const onRemoveData = (evt: MouseEvent<HTMLButtonElement>, field: StateProp) => {
    evt.stopPropagation();
    setEditType(undefined);
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates?.transformData,
        ...defaultData[field as NonNullable<StateProp>],
      },
    });
  };

  const isModifiable = () => {
    if (image) {
      return !(
        image.copyright.license.license.includes('ND') || image.image.contentType.includes('svg')
      );
    }
  };

  const imageCancelButtonNeeded =
    (editType === 'focalPoint' && imageUpdates?.transformData.focalX) ||
    (editType === 'crop' && imageUpdates?.transformData.upperLeftX);

  return (
    <div>
      <StyledImageEditorEditMode>
        <div>
          <StyledImageEditorMenu>
            {alignments.map((alignment) => (
              <ImageAlignButton
                key={`align_${alignment}`}
                alignType={alignment}
                onFieldChange={onFieldChange}
                currentAlign={imageUpdates?.align}
              />
            ))}
          </StyledImageEditorMenu>
          {imageUpdates?.align === 'left' || imageUpdates?.align === 'right' ? (
            <StyledImageEditorMenu>
              {sizes.map((size) => (
                <ImageSizeButton
                  key={`size_${size}`}
                  size={size}
                  onFieldChange={onFieldChange}
                  currentSize={imageUpdates?.size}
                />
              ))}
            </StyledImageEditorMenu>
          ) : (
            ''
          )}
          {imageUpdates?.size?.startsWith('full') || imageUpdates?.size?.startsWith('medium') ? (
            <StyledImageEditorMenu>
              {bylineOptions.map((option) => (
                <ShowBylineButton
                  key={option}
                  show={option === 'show'}
                  currentSize={imageUpdates.size}
                  onFieldChange={onFieldChange}
                />
              ))}
            </StyledImageEditorMenu>
          ) : (
            ''
          )}
        </div>
        <ImageTransformEditor
          onFocalPointChange={onFocalPointChange}
          onCropComplete={onCropComplete}
          embed={embed}
          transformData={imageUpdates?.transformData}
          editType={editType}
          language={language}
        />
        <StyledImageEditorMenu>
          {isModifiable() && (
            <Tooltip tooltip={t('form.image.focalPoint')}>
              <ImageEditorButton
                tabIndex={-1}
                isActive={embed.focalX !== undefined}
                onClick={(evt: MouseEvent<HTMLButtonElement>) => onEditorTypeSet(evt, 'focalPoint')}
              >
                <FocalPoint />
              </ImageEditorButton>
            </Tooltip>
          )}
          {imageCancelButtonNeeded && (
            <ButtonV2
              onClick={(evt: MouseEvent<HTMLButtonElement>) => onRemoveData(evt, editType)}
              variant="stripped"
            >
              {t(`imageEditor.remove.${editType}`)}
            </ButtonV2>
          )}
          {isModifiable() && (
            <Tooltip tooltip={t('form.image.crop')}>
              <ImageEditorButton
                isActive={embed.upperLeftX !== undefined}
                onClick={(evt: MouseEvent<HTMLButtonElement>) => onEditorTypeSet(evt, 'crop')}
                tabIndex={-1}
              >
                <Crop />
              </ImageEditorButton>
            </Tooltip>
          )}
        </StyledImageEditorMenu>
      </StyledImageEditorEditMode>
    </div>
  );
};

export default ImageEditor;
