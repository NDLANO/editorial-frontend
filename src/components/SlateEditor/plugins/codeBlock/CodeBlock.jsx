import React, { Component, createRef } from 'react';
import Types from 'slate-prop-types';
import styled from '@emotion/styled';

import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import { Codeblock, getTitleFromFormat } from '@ndla/code';

import { getSchemaEmbed } from '../../editorSchema';
import { EditorShape } from '../../../../shapes';
import EditCodeBlock from './EditCodeBlock';

const CodeDiv = styled.div`
  cursor: pointer;
`;

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
      title:
        codeBlock.title ||
        getTitleFromFormat(codeBlock.format || data['code-format']) ||
        'Text', // TODO tar gjerne i mot forslag for å forbedre denne
      format: codeBlock.format || data['code-format'] || 'text',
    },
    isFirstEdit: data.codeBlock === undefined,
  };
};

class CodeBlock extends Component {
  constructor(props) {
    super(props);
    const { isFirstEdit, model } = getInfoFromNode(props.node);
    this.state = { isFirstEdit, editMode: !model.code };
    this.codeBlockRef = createRef();
    this.toggleEditMode = this.toggleEditMode.bind(this);
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
    const { editor, node } = this.props;
    const { editMode } = this.state;
    const { model } = getInfoFromNode(node);

    const removeCodeblock = (
      <Button stripped onClick={this.handleRemove}>
        <Cross />
      </Button>
    );

    return (
      <>
        <CodeDiv
          draggable
          ref={this.codeBlockRef}
          onClick={this.toggleEditMode}
          tabIndex={0}
          role="button">
          <Codeblock
            actionButton={removeCodeblock}
            code={model.code}
            format={model.format}
            title={model.title}
          />
        </CodeDiv>

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
