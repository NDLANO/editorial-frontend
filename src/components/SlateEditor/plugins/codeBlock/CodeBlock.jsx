import React, { Component, createRef } from 'react';
// import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import he from 'he';

import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Codeblock } from '@ndla/ui';

import MathMenu from '../mathml/MathMenu';
import { Portal } from '../../../Portal';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import EditCodeBlock from './EditCodeBlock';

const getInfoFromNode = node => {
  const data = node?.data ? node.data.toJS() : {};
  const codeBlock = data.codeBlock || node.text;
  return {
    model: {
      code: codeBlock?.code ? codeBlock.code : codeBlock,
      title: codeBlock.title || 'Text', // pure text w/o highlighting
      format: codeBlock.format || 'text',
    },
    isFirstEdit: data.codeBlock === undefined,
  };
};

class CodeBlock extends Component {
  constructor(props) {
    super(props);
    const { isFirstEdit } = getInfoFromNode(props.node);
    this.state = { isFirstEdit, editMode: isFirstEdit, showMenu: false };
    this.codeBlockRef = createRef();
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  getMenuPosition() {
    if (this.codeBlockRef.current) {
      const rect = this.codeBlockRef.current.getBoundingClientRect();
      return {
        top: window.scrollY + rect.top + rect.height,
        left: rect.left,
      };
    }
    return {
      top: 0,
      left: 0,
    };
  }

  toggleEditMode() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  toggleMenu() {
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  }

  handleSave(codeBlock) {
    const { node, editor } = this.props;
    const properties = {
      data: { ...getSchemaEmbed(node), codeBlock: codeBlock },
    };
    editor.setNodeByKey(node.key, properties);
    this.setState({ isFirstEdit: false, editMode: false });
  }

  handleRemove() {
    const { editor, node } = this.props;
    editor.removeNodeByKey(node.key);
    editor.focus();
  }

  onExit = () => {
    this.setState(prevState => ({ editMode: false }));
    if (this.state.isFirstEdit) {
      this.handleRemove();
    }
  };

  render() {
    const { t, editor, node } = this.props;
    const { editMode, showMenu } = this.state;
    const { model } = getInfoFromNode(node);
    const { top, left } = this.getMenuPosition();

    return (
      <>
        <span
          ref={this.codeBlockRef}
          onClick={this.toggleMenu}
          onKeyPress={this.toggleMenu}
          tabIndex={0}
          role="button">
          <Codeblock code={model.code} format={model.format} />

          <Portal isOpened={showMenu}>
            <MathMenu
              top={top}
              left={left}
              t={t}
              handleRemove={this.handleRemove}
              toggleEdit={this.toggleEditMode}
              toggleMenu={this.toggleMenu}
            />
          </Portal>
        </span>

        {editMode && (
          <EditCodeBlock
            blur={editor.blur}
            closeDialog={this.toggleEditMode}
            editor={editor}
            handleSave={this.handleSave}
            model={model}
            node={node}
            onChange={editor.onChange}
          />
        )}
      </>
    );
  }
}

CodeBlock.propTypes = {
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(CodeBlock);
