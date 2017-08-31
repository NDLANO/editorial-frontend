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
import { getSchemaEmbed } from '../../components/SlateEditor/schema';
import { EmbedShape } from '../../shapes';
import ImageFocalPointEdit from './ImageFocalPointEdit';

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
        ...getSchemaEmbed(node),
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
    const { embed } = this.props;
    const src = `${window.config
      .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
    return (
      <div {...classes()}>
        <div
          {...classes('overlay')}
          onClick={this.onDocumentClick}
          role="presentation"
        />
        <div {...classes('edit')}>
          <div {...classes('menu')}>
            <Button stripped onClick={() => this.onEditorTypeSet('focalPoint')}>
              Rediger fokus punkt
            </Button>
          </div>
          {this.state.editType === 'focalPoint'
            ? <ImageFocalPointEdit
                embed={embed}
                focalPoint={this.state.focalPoint}
                onFocalPointChange={this.onFocalPointChange}
              />
            : <figure>
                <img src={src} alt={embed.alt} />
              </figure>}
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
