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
import { FocalPoint, Crop } from 'ndla-ui/icons';
import { getSchemaEmbed } from '../../components/SlateEditor/schema';
import { EmbedShape } from '../../shapes';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

const defaultState = {
  editType: undefined,
};

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.onFocalPointChange = this.onFocalPointChange.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onAlignChange = this.onAlignChange.bind(this);
    this.onEditorTypeSet = this.onEditorTypeSet.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
  }
  onDataChange(data) {
    const { node, editor } = this.props;
    const properties = {
      data,
    };
    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply();

    editor.onChange(next);
  }

  onFocalPointChange(focalPoint) {
    const { node } = this.props;
    const data = {
      ...getSchemaEmbed(node),
      'focal-x': focalPoint.x,
      'focal-y': focalPoint.y,
    };
    this.onDataChange(data);
  }

  onCropChange(crop) {
    const { node } = this.props;
    const data = {
      ...getSchemaEmbed(node),
      'upper-left-x': crop.x,
      'upper-left-y': crop.y,
      'lower-right-x': crop.x + crop.width,
      'lower-right-y': crop.y + crop.height,
      'focal-x': '',
      'focal-y': '',
    };
    this.onDataChange(data);
  }

  onAlignChange(evt, alignment) {
    evt.stopPropagation();
    const { node } = this.props;
    const data = {
      ...getSchemaEmbed(node),
      align: alignment,
    };
    this.setState(defaultState);
    this.onDataChange(data);
  }

  onEditorTypeSet(evt, type) {
    this.setState({ editType: type });
  }

  onDocumentClick() {
    this.setState(defaultState);
    this.props.toggleEditModus();
  }
  onRemoveData(field) {
    const { node } = this.props;
    const defaultData = {
      focalPoint: {
        'focal-x': '',
        'focal-y': '',
      },
      crop: {
        'upper-left-x': '',
        'upper-left-y': '',
        'lower-right-x': '',
        'lower-right-y': '',
        'focal-x': '',
        'focal-y': '',
      }
    }
    const data = {
      ...getSchemaEmbed(node),
      ...defaultData[field]
    };
    this.onDataChange(data);
  }
  render() {
    const { embed } = this.props;
    return (
      <div {...classes()}>
        <div
          {...classes('overlay')}
          onClick={this.onDocumentClick}
          role="presentation"
        />
        <div {...classes('edit')}>
          <div {...classes('top-menu')}>
            <ImageAlignButton
              alignType="left"
              onAlignChange={this.onAlignChange}
              embed={embed}
            />
            <ImageAlignButton
              alignType="center"
              onAlignChange={this.onAlignChange}
              embed={embed}
            />
            <ImageAlignButton
              alignType="right"
              onAlignChange={this.onAlignChange}
              embed={embed}
            />
          </div>
          <ImageTransformEditor
            onFocalPointChange={this.onFocalPointChange}
            onCropChange={this.onCropChange}
            embed={embed}
            editType={this.state.editType}
          />
          <div {...classes('bottom-menu')}>
            <Button
              stripped
              onClick={evt => this.onEditorTypeSet(evt, 'focalPoint')}>
              <FocalPoint />
            </Button>
            {this.state.editType
              ? <Button stripped>
                  {`Fjern ${this.state.editType}`}
                </Button>
              : ''}
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
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
  editor: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }),
};

export default ImageEditor;
