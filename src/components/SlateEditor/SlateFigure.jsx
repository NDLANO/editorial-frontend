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
import EditorErrorMessage from './EditorErrorMessage';
import DisplayOembed from '../DisplayEmbedTag/DisplayOembed';
import ForbiddenOverlay from '../ForbiddenOverlay';
import { getSchemaEmbed } from './schema';
import { NodeShape, EditorShape } from '../../shapes';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateFigure extends React.Component {
  constructor(props) {
    super();
    this.state = {
      submitted: props.editor.props.submitted,
    };
    this.isSelected = this.isSelected.bind(this);
    this.onFigureInputChange = this.onFigureInputChange.bind(this);
    this.onSubmittedChange = this.onSubmittedChange.bind(this);
  }

  componentWillMount() {
    const { editor: { props: { slateStore } } } = this.props;
    this.unsubscribe = slateStore.subscribe(this.onSubmittedChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSubmittedChange() {
    const { editor: { props: { slateStore } } } = this.props;
    this.setState({
      submitted: slateStore.getState().submitted,
    });
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
    const { node, deletedOnSave, attributes, editor } = this.props;

    const embed = getSchemaEmbed(node);

    const props = {
      embed,
      onFigureInputChange: this.onFigureInputChange,
      figureClass,
      attributes,
      deletedOnSave,
      submitted: this.state.submitted,
    };

    switch (embed.resource) {
      case 'image':
        return <SlateImage node={node} editor={editor} {...props} />;
      case 'brightcove':
        return <SlateVideo {...props} />;
      case 'audio':
        return <SlateAudio {...props} />;
      case 'h5p':
        return <DisplayOembed url={embed.url} />;
      default:
        return (
          <EditorErrorMessage
            attributes={this.props.attributes}
            msg={this.props.t(
              'learningResourceForm.fields.content.figure.notSupported',
              { mediaType: embed.resource },
            )}>
            {this.props.deletedOnSave &&
              <ForbiddenOverlay
                text={this.props.t(
                  'topicArticleForm.fields.content.deleteEmbedOnSave',
                )}
              />}
          </EditorErrorMessage>
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
  node: NodeShape,
  editor: EditorShape,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
