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
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import SlateImage from './SlateImage';
import SlateVideo from './SlateVideo';
import SlateAudio from './SlateAudio';
import EditorErrorMessage from '../../EditorErrorMessage';
import DisplayExternal from '../../../DisplayEmbed/DisplayExternal';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import EditImage from './EditImage';

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
    this.saveEmbedUpdates = this.saveEmbedUpdates.bind(this);
    this.onSubmittedChange = this.onSubmittedChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  componentDidMount() {
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
    this.saveEmbedUpdates({ [name]: value });
  }

  saveEmbedUpdates(updates) {
    const { node, editor } = this.props;
    const properties = {
      data: { ...getSchemaEmbed(node), ...updates },
    };
    editor.setNodeByKey(node.key, properties);
  }

  onRemoveClick(e) {
    e.stopPropagation();
    const { node, editor } = this.props;
    editor.removeNodeByKey(node.key);
  }

  isSelected() {
    const { node, editor } = this.props;
    const isSelected = editor.value.selection.anchor.isInNode(node);
    return isSelected;
  }

  render() {
    const active = this.isSelected();
    const figureClass = editorClasses('figure', active ? 'active' : '');
    const {
      node,
      attributes,
      editor,
      language,
      isSelected: isSelectedForCopy,
    } = this.props;

    const embed = getSchemaEmbed(node);

    const props = {
      embed,
      onFigureInputChange: this.onFigureInputChange,
      saveEmbedUpdates: this.saveEmbedUpdates,
      figureClass,
      attributes,
      submitted: this.state.submitted,
      language,
      isSelectedForCopy,
      active,
    };
    switch (embed.resource) {
      case 'image':
        return (
          <SlateImage
            node={node}
            editor={editor}
            onRemoveClick={this.onRemoveClick}
            language={language}
            renderEditComponent={props => (
              <EditImage imageLanguage={language} {...props} />
            )}
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
          <DisplayExternal
            onRemoveClick={this.onRemoveClick}
            editor={editor}
            node={node}
            embed={embed}
          />
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
  language: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

SlateFigure.defaultProps = {
  className: '',
};

export default injectT(SlateFigure);
