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
import styled from 'react-emotion';
import defined from 'defined';
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

const sizes = ['xsmall', 'small', 'fullwidth'];

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
  constructor(props) {
    super(props);
    const { embed } = props;
    this.state = {
      editType: undefined,
      transformData: {
        'focal-x': embed['focal-x'],
        'focal-y': embed['focal-y'],
        'upper-left-x': embed['upper-left-x'],
        'upper-left-y': embed['upper-left-y'],
        'lower-right-x': embed['lower-right-x'],
        'lower-right-y': embed['lower-right-y'],
      },
      align: defined(embed.align, ''),
      size: defined(embed.size, ''),
    };
    this.onFocalPointChange = this.onFocalPointChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onEditorTypeSet = this.onEditorTypeSet.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onRemoveData = this.onRemoveData.bind(this);
  }

  onFocalPointChange(focalPoint) {
    this.setState(
      prevState => ({
        transformData: {
          ...prevState.transformData,
          'focal-x': focalPoint.x,
          'focal-y': focalPoint.y,
        },
      }),
      this.props.onUpdatedImageSettings(this.state),
    );
  }

  onCropComplete(crop, size) {
    if (size.width === 0) {
      this.setState(
        {
          transformData: defaultData.crop,
          editType: undefined,
        },
        this.props.onUpdatedImageSettings(this.state),
      );
    } else {
      this.setState(
        {
          transformData: {
            'upper-left-x': crop.x,
            'upper-left-y': crop.y,
            'lower-right-x': crop.x + crop.width,
            'lower-right-y': crop.y + crop.height,
            ...defaultData.focalPoint,
          },
        },
        this.props.onUpdatedImageSettings(this.state),
      );
    }
  }

  onFieldChange(evt, field, value) {
    evt.stopPropagation();
    this.setState(
      {
        editType: undefined,
        [field]: value,
      },
      this.props.onUpdatedImageSettings(this.state),
    );
  }

  onEditorTypeSet(evt, type) {
    this.setState({ editType: type });
  }

  onRemoveData(evt, field) {
    evt.stopPropagation();
    this.setState(
      prevState => ({
        editType: undefined,
        transformData: {
          ...prevState.transformData,
          ...defaultData[field],
        },
      }),
      this.props.onUpdatedImageSettings(this.state),
    );
  }

  render() {
    const { embed, t } = this.props;

    const imageCancelButtonNeeded =
      this.state.editType &&
      ((this.state.editType === 'focalPoint' &&
        this.state.transformData['focal-x']) ||
        (this.state.editType === 'crop' &&
          this.state.transformData['upper-left-x']));

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
                  currentAlign={this.state.align}
                />
              ))}
            </StyledImageEditorMenu>
            {this.state.align === 'left' || this.state.align === 'right' ? (
              <StyledImageEditorMenu>
                {sizes.map(size => (
                  <ImageSizeButton
                    key={`size_${size}`}
                    size={size}
                    onFieldChange={this.onFieldChange}
                    currentSize={this.state.size}
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
            transformData={this.state.transformData}
            editType={this.state.editType}
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
                onClick={evt => this.onRemoveData(evt, this.state.editType)}
                stripped>
                {t(`imageEditor.remove.${this.state.editType}`)}
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
};

export default injectT(ImageEditor);
