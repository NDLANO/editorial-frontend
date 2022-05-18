/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useEffect, useState } from 'react';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { Crop, FocalPoint } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';
import ImageSizeButton from './ImageSizeButton';
import ImageEditorButton from './ImageEditorButton';
import { ImageEmbed } from '../../interfaces';
import { fetchImage } from '../../modules/image/imageApi';
import ShowBylineButton from './ShowBylineButton';

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

const defaultData = {
  focalPoint: {
    'focal-x': undefined,
    'focal-y': undefined,
  },
  crop: {
    'upper-left-x': undefined,
    'upper-left-y': undefined,
    'lower-right-x': undefined,
    'lower-right-y': undefined,
    'focal-x': undefined,
    'focal-y': undefined,
  },
};

interface Props {
  embed: ImageEmbed;
  onUpdatedImageSettings: Function;
  imageUpdates:
    | {
        transformData: {
          'focal-x'?: string;
          'focal-y'?: string;
          'upper-left-x'?: string;
          'upper-left-y'?: string;
          'lower-right-x'?: string;
          'lower-right-y'?: string;
        };
        align?: string;
        size?: string;
      }
    | undefined;
}

type StateProp = 'crop' | 'focalPoint' | undefined;

const ImageEditor = ({ embed, onUpdatedImageSettings, imageUpdates }: Props) => {
  const { t } = useTranslation();
  const [editType, setEditType] = useState<StateProp>(undefined);
  const [image, setImage] = useState<IImageMetaInformationV2 | undefined>(undefined);

  useEffect(() => {
    const getImage = async () => {
      const img = await fetchImage(embed.resource_id, 'nb');
      setImage(img);
    };
    getImage();
  }, [embed]);

  const onFocalPointChange = (focalPoint: { x: number; y: number }) => {
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates?.transformData,
        'focal-x': focalPoint.x.toString(),
        'focal-y': focalPoint.y.toString(),
      },
    });
  };

  const onCropComplete = (crop: ReactCrop.Crop, size: ReactCrop.PixelCrop) => {
    let width = crop.width ?? 0;
    let height = crop.height ?? 0;
    if (size.width === 0) {
      setEditType(undefined);
      onUpdatedImageSettings({ transformData: defaultData.crop });
    } else {
      onUpdatedImageSettings({
        transformData: {
          'upper-left-x': crop.x.toString(),
          'upper-left-y': crop.y.toString(),
          'lower-right-x': (crop.x + width).toString(),
          'lower-right-y': (crop.y + height).toString(),
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
      return !(image.copyright.license.license.includes('ND') || image.contentType.includes('svg'));
    }
  };

  const imageCancelButtonNeeded =
    (editType === 'focalPoint' && imageUpdates?.transformData['focal-x']) ||
    (editType === 'crop' && imageUpdates?.transformData['upper-left-x']);

  return (
    <div>
      <StyledImageEditorEditMode>
        <div>
          <StyledImageEditorMenu>
            {alignments.map(alignment => (
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
              {sizes.map(size => (
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
              {bylineOptions.map(option => (
                <ShowBylineButton
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
        />
        <StyledImageEditorMenu>
          {isModifiable() && (
            <Tooltip tooltip={t('form.image.focalPoint')}>
              <ImageEditorButton
                stripped
                tabIndex={-1}
                isActive={embed['focal-x'] !== undefined}
                onClick={(evt: MouseEvent<HTMLButtonElement>) =>
                  onEditorTypeSet(evt, 'focalPoint')
                }>
                <FocalPoint />
              </ImageEditorButton>
            </Tooltip>
          )}
          {imageCancelButtonNeeded && (
            <Button
              onClick={(evt: MouseEvent<HTMLButtonElement>) => onRemoveData(evt, editType)}
              stripped>
              {t(`imageEditor.remove.${editType}`)}
            </Button>
          )}
          {isModifiable() && (
            <Tooltip tooltip={t('form.image.crop')}>
              <ImageEditorButton
                stripped
                isActive={embed['upper-left-x'] !== undefined}
                onClick={(evt: MouseEvent<HTMLButtonElement>) => onEditorTypeSet(evt, 'crop')}
                tabIndex={-1}>
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
