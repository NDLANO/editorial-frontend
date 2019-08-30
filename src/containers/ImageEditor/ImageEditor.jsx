/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { Crop, FocalPoint } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import { EmbedShape } from '../../shapes';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';
import ImageSizeButton from './ImageSizeButton';
import ImageEditorButton from './ImageEditorButton';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

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

const sizes = ['xsmall', 'small', 'medium', 'fullwidth'];

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

class ImageEditor extends Component {
  constructor() {
    super();
    this.state = {
      editType: undefined,
    };
    this.onFocalPointChange = this.onFocalPointChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onEditorTypeSet = this.onEditorTypeSet.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onRemoveData = this.onRemoveData.bind(this);
  }

  onFocalPointChange(focalPoint) {
    const { onUpdatedImageSettings, imageUpdates } = this.props;
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates.transformData,
        'focal-x': focalPoint.x.toString(),
        'focal-y': focalPoint.y.toString(),
      },
    });
  }

  onCropComplete(crop, size) {
    const { onUpdatedImageSettings } = this.props;
    if (size.width === 0) {
      this.setState({
        editType: undefined,
      });
      onUpdatedImageSettings({ transformData: defaultData.crop });
    } else {
      onUpdatedImageSettings({
        transformData: {
          'upper-left-x': crop.x.toString(),
          'upper-left-y': crop.y.toString(),
          'lower-right-x': (crop.x + crop.width).toString(),
          'lower-right-y': (crop.y + crop.height).toString(),
          ...defaultData.focalPoint,
        },
      });
    }
  }

  onFieldChange(evt, field, value) {
    const { onUpdatedImageSettings } = this.props;
    evt.stopPropagation();
    onUpdatedImageSettings({ [field]: value });
  }

  onEditorTypeSet(evt, type) {
    this.setState({ editType: type });
  }

  onRemoveData(evt, field) {
    evt.stopPropagation();
    const { imageUpdates, onUpdatedImageSettings } = this.props;
    this.setState({
      editType: undefined,
    });
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates.transformData,
        ...defaultData[field],
      },
    });
  }

  render() {
    const {
      embed,
      t,
      imageUpdates: { transformData, align, size: currentSize },
    } = this.props;
    const { editType } = this.state;

    const imageCancelButtonNeeded =
      (editType === 'focalPoint' && transformData['focal-x']) ||
      (editType === 'crop' && transformData['upper-left-x']);

    return (
      <div {...classes()}>
        <StyledImageEditorEditMode>
          <div>
            <StyledImageEditorMenu>
              {alignments.map(alignment => (
                <ImageAlignButton
                  key={`align_${alignment}`}
                  alignType={alignment}
                  onFieldChange={this.onFieldChange}
                  currentAlign={align}
                />
              ))}
            </StyledImageEditorMenu>
            {align === 'left' || align === 'right' ? (
              <StyledImageEditorMenu>
                {sizes.map(size => (
                  <ImageSizeButton
                    key={`size_${size}`}
                    size={size}
                    onFieldChange={this.onFieldChange}
                    currentSize={currentSize}
                  />
                ))}
              </StyledImageEditorMenu>
            ) : (
              ''
            )}
          </div>
          <ImageTransformEditor
            onFocalPointChange={this.onFocalPointChange}
            onCropComplete={this.onCropComplete}
            embed={embed}
            transformData={transformData}
            editType={editType}
          />
          <StyledImageEditorMenu>
            <Tooltip tooltip={t('form.image.focalPoint')}>
              <ImageEditorButton
                stripped
                tabIndex={-1}
                onClick={evt => this.onEditorTypeSet(evt, 'focalPoint')}>
                <FocalPoint />
              </ImageEditorButton>
            </Tooltip>
            {imageCancelButtonNeeded && (
              <Button
                onClick={evt => this.onRemoveData(evt, editType)}
                stripped>
                {t(`imageEditor.remove.${editType}`)}
              </Button>
            )}
            <Tooltip tooltip={t('form.image.crop')}>
              <ImageEditorButton
                stripped
                onClick={evt => this.onEditorTypeSet(evt, 'crop')}
                tabIndex={-1}>
                <Crop />
              </ImageEditorButton>
            </Tooltip>
          </StyledImageEditorMenu>
        </StyledImageEditorEditMode>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  embed: EmbedShape.isRequired,
  toggleEditModus: PropTypes.func.isRequired,
  onUpdatedImageSettings: PropTypes.func.isRequired,
  imageUpdates: PropTypes.shape({
    transformData: PropTypes.object,
    align: PropTypes.string,
    size: PropTypes.string,
  }).isRequired,
};

export default injectT(ImageEditor);
