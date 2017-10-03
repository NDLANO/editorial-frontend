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
import Types from 'slate-prop-types';
import { Figure } from 'ndla-ui';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayOembed from '../../../DisplayEmbedTag/DisplayOembed';
import DisplayExternal from '../../../DisplayEmbedTag/DisplayExternal';
import { getSchemaEmbed } from '../../schema';
import { EditorShape } from '../../../../shapes';

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
    const next = editor.getState().change().setNodeByKey(node.key, properties);
    editor.onChange(next);
  }

  isSelected() {
    const { node, state } = this.props;
    const isSelected = state.selection.hasEdgeIn(node);
    return isSelected;
  }

  render() {
    const figureClass = classes('figure', this.isSelected() ? 'active' : '');
    const { node, attributes, editor } = this.props;

    const embed = getSchemaEmbed(node);

    const props = {
      embed,
      onFigureInputChange: this.onFigureInputChange,
      figureClass,
      attributes,
      submitted: this.state.submitted,
    };
    switch (embed.resource) {
      case 'image':
        return <SlateImage node={node} editor={editor} {...props} />;
      case 'brightcove':
        return <SlateVideo {...props} />;
      case 'audio':
        return <SlateAudio {...props} />;
      case 'external':
        return (
          <Figure>
            <DisplayExternal url={embed.url} />
          </Figure>
        );
      case 'h5p':
        return <DisplayOembed url={embed.url} />;
      default:
        return (
          <EditorErrorMessage
            attributes={this.props.attributes}
            msg={this.props.t('form.content.figure.notSupported', {
              mediaType: embed.resource,
            })}
          />
        );
    }
  }
}

SlateFigure.propTypes = {
  className: PropTypes.string,
  state: Types.state.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
