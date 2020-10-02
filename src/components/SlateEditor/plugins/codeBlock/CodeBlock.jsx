import React, { Component, createRef } from 'react';
import Types from 'slate-prop-types';

import { injectT } from '@ndla/i18n';
import { Codeblock } from '@ndla/ui';
import { getTitleFromFormat } from '@ndla/editor';

import MathMenu from '../mathml/MathMenu';
import { Portal } from '../../../Portal';
import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import EditCodeBlock from './EditCodeBlock';

const getInfoFromNode = node => {
  const data = node?.data ? node.data.toJS() : {};
  const codeBlock = data.codeBlock || node.text;

  return {
    // TODO er veldig usikker på denne, her har jeg basert meg på matte komponenten, se kommentar under
    // Dataen kommer på to ulike formater.
    // Frontend-packages forventer et Kode object med {code, title, format},
    // men noen data-* attributter (data-format, data-content) er alt definert på embed (???),
    // derfor lagres dataen som data-code-format og data-code-content i embed taggen
    model: {
      code: codeBlock.code || data['code-content'] || '',
      title: codeBlock.title ? codeBlock.title : 'Text',
      format: codeBlock.format || data['code-format'] || 'text',
    },
    isFirstEdit: data.codeBlock === undefined,
  };
};

class CodeBlock extends Component {
  constructor(props) {
    super(props);
    const { isFirstEdit, model } = getInfoFromNode(props.node);
    this.state = { isFirstEdit, editMode: !model.code, showMenu: false };
    this.codeBlockRef = createRef();
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.onExit = this.onExit.bind(this);
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

  handleUndo() {
    const { editor, node } = this.props;
    editor.unwrapBlockByKey(node.key, 'code-block');
    editor.focus();
  }

  onExit() {
    this.setState(prevState => ({ editMode: false }));

    if (this.state.isFirstEdit) {
      this.handleUndo();
    }
  }

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
          <Codeblock
            code={model.code}
            format={model.format}
            title={getTitleFromFormat(model.format)}
          />

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
            editor={editor}
            onChange={editor.onChange}
            node={node}
            closeDialog={this.toggleEditMode}
            handleSave={this.handleSave}
            model={model}
            onExit={this.onExit}
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
