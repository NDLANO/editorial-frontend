/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { injectT } from 'ndla-i18n';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import ForbiddenOverlay from '../ForbiddenOverlay';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateFigure extends React.Component {
  constructor() {
    super();
    this.isSelected = this.isSelected.bind(this);
    this.getSchemaEmbedTag = this.getSchemaEmbedTag.bind(this);
    this.onFigureInputChange = this.onFigureInputChange.bind(this);
  }

  onFigureInputChange(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    const { node, editor } = this.props;

    const properties = {
      data: { ...this.getSchemaEmbedTag(), [name]: value },
    };
    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply();
    editor.onChange(next);
  }

  getSchemaEmbedTag() {
    const { node } = this.props;
    return {
      caption: node.get('data').get('caption'),
      alt: node.get('data').get('alt'),
      id: node.get('data').get('id'),
      resource: node.get('data').get('resource'),
    };
  }

  isSelected() {
    const { node, state } = this.props;
    const isSelected = state.selection.hasEdgeIn(node);
    return isSelected;
  }

  render() {
    const figureClass = classes('figure', this.isSelected() ? 'active' : '');

    const embedTag = this.getSchemaEmbedTag();
    switch (embedTag.resource) {
      case 'image':
        return (
          <SlateImage
            embedTag={embedTag}
            onFigureInputChange={this.onFigureInputChange}
            figureClass={figureClass}
            {...this.props}
          />
        );
      case 'brightcove':
        return (
          <SlateVideo
            embedTag={embedTag}
            figureClass={figureClass}
            onFigureInputChange={this.onFigureInputChange}
            {...this.props}
          />
        );
      default:
        return (
          <div
            {...classes('figure', 'not-supported')}
            {...this.props.attributes}>
            <span>
              {this.props.t(
                'learningResourceForm.fields.content.figure.notSupported',
                { mediaType: embedTag.resource },
              )}
            </span>
            {this.props.deletedOnSave &&
              <ForbiddenOverlay
                text={this.props.t(
                  'topicArticleForm.fields.content.deleteEmbedOnSave',
                )}
              />}
          </div>
        );
    }
  }
}

SlateFigure.propTypes = {
  className: PropTypes.string,
  state: PropTypes.shape({
    selection: PropTypes.shape({
      hasEdgeIn: PropTypes.func.isRequired,
    }),
  }),
  node: PropTypes.object.isRequired,
  editor: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }),
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
