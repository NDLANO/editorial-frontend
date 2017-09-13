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
import { FocalPoint, Crop } from 'ndla-ui/icons';
import { injectT } from 'ndla-i18n';
import { getSchemaEmbed } from '../../components/SlateEditor/schema';
import { EmbedShape } from '../../shapes';
import ImageTransformEditor from './ImageTransformEditor';
import ImageAlignButton from './ImageAlignButton';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});

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
    };
    this.onFocalPointChange = this.onFocalPointChange.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onAlignChange = this.onAlignChange.bind(this);
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
    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply();
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
        'focal-x': undefined,
        'focal-y': undefined,
      },
    });
    // this.onDataChange(data);
  }

  onAlignChange(evt, alignment) {
    evt.stopPropagation();
    this.setState({
      editType: undefined,
      align: alignment,
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
          <div {...classes('top-menu')}>
            <ImageAlignButton
              alignType="left"
              onAlignChange={this.onAlignChange}
              currentAlign={this.state.align}
            />
            <ImageAlignButton
              alignType="center"
              onAlignChange={this.onAlignChange}
              currentAlign={this.state.align}
            />
            <ImageAlignButton
              alignType="right"
              onAlignChange={this.onAlignChange}
              currentAlign={this.state.align}
            />
          </div>
          <ImageTransformEditor
            onFocalPointChange={this.onFocalPointChange}
            onCropComplete={this.onCropComplete}
            embed={embed}
            transformData={this.state.transformData}
            editType={this.state.editType}
          />
          <div {...classes('bottom-menu')}>
            <Button
              stripped
              onClick={evt => this.onEditorTypeSet(evt, 'focalPoint')}>
              <FocalPoint />
            </Button>
            <Button stripped onClick={this.onSave}>
              {t('imageEditor.save')}
            </Button>
            {this.state.editType
              ? <Button
                  onClick={evt => this.onRemoveData(evt, this.state.editType)}
                  stripped>
                  {t(`imageEditor.remove.${this.state.editType}`)}
                </Button>
              : ''}
            <Button stripped onClick={this.onAbort}>
              {t('imageEditor.abort')}
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
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
  editor: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }),
};

export default injectT(ImageEditor);
