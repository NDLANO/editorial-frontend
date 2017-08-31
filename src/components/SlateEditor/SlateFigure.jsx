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
import SlateAudio from './SlateAudio';
import ForbiddenOverlay from '../ForbiddenOverlay';
import { getSchemaEmbed } from './schema';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateFigure extends React.Component {
  constructor() {
    super();
    this.isSelected = this.isSelected.bind(this);
    this.onFigureInputChange = this.onFigureInputChange.bind(this);
  }

  onFigureInputChange(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    const { node, editor } = this.props;

    const properties = {
      data: { ...getSchemaEmbed(node), [name]: value },
    };
    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, properties)
      .apply();
    editor.onChange(next);
  }

  isSelected() {
    const { node, state } = this.props;
    const isSelected = state.selection.hasEdgeIn(node);
    return isSelected;
  }

  render() {
    const figureClass = classes('figure', this.isSelected() ? 'active' : '');

    const embed = getSchemaEmbed(this.props.node);

    switch (embed.resource) {
      case 'image':
        return (
          <SlateImage
            embed={embed}
            onFigureInputChange={this.onFigureInputChange}
            figureClass={figureClass}
            {...this.props}
          />
        );
      case 'brightcove':
        return (
          <SlateVideo
            embed={embed}
            figureClass={figureClass}
            onFigureInputChange={this.onFigureInputChange}
            {...this.props}
          />
        );
      case 'audio':
        return (
          <SlateAudio embed={embed} figureClass={figureClass} {...this.props} />
        );
      default:
        return (
          <div
            {...classes('figure', 'not-supported')}
            {...this.props.attributes}>
            <span>
              {this.props.t(
                'learningResourceForm.fields.content.figure.notSupported',
                { mediaType: embed.resource },
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
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
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
