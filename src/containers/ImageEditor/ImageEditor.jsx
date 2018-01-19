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
import { Button } from 'ndla-ui';
import defined from 'defined';
import Types from 'slate-prop-types';
import { Crop, FocalPoint } from 'ndla-icons/editor';
import { injectT } from 'ndla-i18n';
import { getSchemaEmbed } from '../../components/SlateEditor/schema';
import { EmbedShape, EditorShape } from '../../shapes';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';
import ImageSizeButton from './ImageSizeButton';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

const aligmnents = ['left', 'center', 'right'];

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
    this.onDataChange = this.onDataChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onEditorTypeSet = this.onEditorTypeSet.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onAbort = this.onAbort.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onRemoveData = this.onRemoveData.bind(this);
  }

  onDataChange(data) {
    const { node, editor } = this.props;
    const properties = {
      data,
    };
    const next = editor.value.change().setNodeByKey(node.key, properties);
    editor.onChange(next);
  }

  onFocalPointChange(focalPoint) {
    this.setState(prevState => ({
      transformData: {
        ...prevState.transformData,
        'focal-x': focalPoint.x,
        'focal-y': focalPoint.y,
      },
    }));
  }

  onCropComplete(crop) {
    this.setState({
      transformData: {
        'upper-left-x': crop.x,
        'upper-left-y': crop.y,
        'lower-right-x': crop.x + crop.width,
        'lower-right-y': crop.y + crop.height,
        ...defaultData.focalPoint,
      },
    });
  }

  onFieldChange(evt, field, value) {
    evt.stopPropagation();
    this.setState({
      editType: undefined,
      [field]: value,
    });
  }

  onEditorTypeSet(evt, type) {
    this.setState({ editType: type });
  }

  onSave(evt) {
    evt.stopPropagation();
    const { node } = this.props;
    const data = {
      ...getSchemaEmbed(node),
      ...this.state.transformData,
      align: this.state.align,
      size: this.state.size,
    };
    this.onDataChange(data);
    this.props.toggleEditModus();
  }

  onAbort(evt) {
    evt.stopPropagation();
    this.setState({
      editType: undefined,
    });
    this.props.toggleEditModus();
  }

  onRemoveData(evt, field) {
    evt.stopPropagation();
    this.setState(prevState => ({
      editType: undefined,
      transformData: {
        ...prevState.transformData,
        ...defaultData[field],
      },
    }));
  }

  render() {
    const { embed, t } = this.props;

    return (
      <div {...classes()}>
        <div {...classes('edit')}>
          <div>
            <div {...classes('menu')}>
              {aligmnents.map(aligment => (
                <ImageAlignButton
                  key={`align_${aligment}`}
                  alignType={aligment}
                  onFieldChange={this.onFieldChange}
                  currentAlign={this.state.align}
                />
              ))}
            </div>
            {this.state.align === 'left' || this.state.align === 'right' ? (
              <div {...classes('menu')}>
                {sizes.map(size => (
                  <ImageSizeButton
                    key={`size_${size}`}
                    size={size}
                    onFieldChange={this.onFieldChange}
                    currentSize={this.state.size}
                  />
                ))}
              </div>
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
          <div {...classes('menu')}>
            <Button
              stripped
              onClick={evt => this.onEditorTypeSet(evt, 'focalPoint')}>
              <FocalPoint />
            </Button>
            <Button stripped onClick={this.onSave}>
              {t('form.save')}
            </Button>
            {this.state.editType ? (
              <Button
                onClick={evt => this.onRemoveData(evt, this.state.editType)}
                stripped>
                {t(`imageEditor.remove.${this.state.editType}`)}
              </Button>
            ) : (
              ''
            )}
            <Button stripped onClick={this.onAbort}>
              {t('form.abort')}
            </Button>
            <Button stripped onClick={evt => this.onEditorTypeSet(evt, 'crop')}>
              <Crop />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  embed: EmbedShape.isRequired,
  toggleEditModus: PropTypes.func.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(ImageEditor);
