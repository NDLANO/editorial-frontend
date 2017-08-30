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
import ImageEdit from './ImageEdit';
import { getSchemaEmbedTag } from '../../components/SlateEditor/schema';

export const classes = new BEMHelper({
  name: 'image-editor',
  prefix: 'c-',
});
const defaultState = {
  editType: undefined,
  focalPoint: {
    x: undefined,
    y: undefined,
  },
};
class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.onFocalPointChange = this.onFocalPointChange.bind(this);
    this.onEditorTypeSet = this.onEditorTypeSet.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  onFocalPointChange(focalPoint) {
    this.setState({ focalPoint });
    const { node, editor } = this.props;

    const properties = {
      data: {
        ...getSchemaEmbedTag(node),
        focalX: focalPoint.x,
        focalY: focalPoint.y,
      },
    };
    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply();
    editor.onChange(next);
  }

  onEditorTypeSet(type) {
    this.setState({ editType: type });
  }

  onDocumentClick() {
    this.setState(defaultState);
    this.props.toggleEditModus();
  }

  render() {
    const { embedTag } = this.props;
    return (
      <div {...classes()}>
        <div
          {...classes('overlay')}
          onClick={this.onDocumentClick}
          role="presentation"
        />
        <div {...classes('edit')}>
          <div {...classes('top-bar')}>
            <Button stripped onClick={() => this.onEditorTypeSet('focalPoint')}>
              Rediger fokus punkt
            </Button>
          </div>
          <ImageEdit
            embedTag={embedTag}
            editType={this.state.editType}
            focalPoint={this.state.focalPoint}
            onFocalPointChange={this.onFocalPointChange}
          />
        </div>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  embedTag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }),
  toggleEditModus: PropTypes.func.isRequired,
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
  editor: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }),
};

export default ImageEditor;
