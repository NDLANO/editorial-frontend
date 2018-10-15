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
import DisplayExternal from '../../../DisplayEmbedTag/DisplayExternal';
import { getSchemaEmbed } from '../../schema';
import { EditorShape } from '../../../../shapes';

export const editorClasses = new BEMHelper({
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
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  componentWillMount() {
    const {
      editor: {
        props: { slateStore },
      },
    } = this.props;
    this.unsubscribe = slateStore.subscribe(this.onSubmittedChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSubmittedChange() {
    const {
      editor: {
        props: { slateStore },
      },
    } = this.props;
    this.setState({
      submitted: slateStore.getState().submitted,
    });
  }

  onFigureInputChange(e) {
    e.preventDefault();
    const { value, name } = e.target;
    const { node, editor } = this.props;

    const properties = {
      data: { ...getSchemaEmbed(node), [name]: value },
    };
    const next = editor.value.change().setNodeByKey(node.key, properties);
    editor.onChange(next);
  }

  onRemoveClick(e) {
    e.stopPropagation();
    const { node, editor } = this.props;
    const next = editor.value.change().removeNodeByKey(node.key);
    editor.onChange(next);
  }

  isSelected() {
    const { node, editor } = this.props;
    const isSelected = editor.value.selection.anchor.isInNode(node);
    return isSelected;
  }

  render() {
    const figureClass = editorClasses(
      'figure',
      this.isSelected() ? 'active' : '',
    );
    const { node, attributes, editor, locale } = this.props;

    const embed = getSchemaEmbed(node);

    const props = {
      embed,
      onFigureInputChange: this.onFigureInputChange,
      figureClass,
      attributes,
      submitted: this.state.submitted,
      locale,
    };
    switch (embed.resource) {
      case 'image':
        return (
          <SlateImage
            node={node}
            editor={editor}
            onRemoveClick={this.onRemoveClick}
            {...props}
          />
        );
      case 'brightcove':
        return <SlateVideo onRemoveClick={this.onRemoveClick} {...props} />;
      case 'audio':
        return <SlateAudio onRemoveClick={this.onRemoveClick} {...props} />;
      case 'external':
      case 'iframe':
        return (
          <Figure id={embed.url}>
            <DisplayExternal
              onRemoveClick={this.onRemoveClick}
              editor={editor}
              node={node}
              embed={embed}
              url={embed.url}
            />
          </Figure>
        );
      case 'error':
        return (
          <EditorErrorMessage
            onRemoveClick={this.onRemoveClick}
            attributes={this.props.attributes}
            msg={embed.message}
          />
        );
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
  node: Types.node.isRequired,
  editor: EditorShape,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  locale: PropTypes.string.isRequired,
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
