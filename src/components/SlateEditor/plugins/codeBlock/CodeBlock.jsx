import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  const data = node.data?.toJS() || {};
  const codeBlock = data['code-block'] || node.text;

  const code = codeBlock.code || data['code-content'] || '';
  const format = codeBlock.format || data['code-format'] || 'text';

  return {
    model: {
      code,
      title: codeBlock.title || getTitleFromFormat(format),
      format,
    },
    isFirstEdit: data['code-block'] === undefined,
  };
};

class CodeBlock extends Component {
  constructor(props) {
    super(props);
    const { isFirstEdit, model } = getInfoFromNode(props.node);
    this.state = { isFirstEdit, editMode: !model.code };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.onExit = this.onExit.bind(this);
  }

  toggleEditMode() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  handleSave(codeBlock) {
    const { node, editor } = this.props;
    const properties = {
      data: { ...getSchemaEmbed(node), 'code-block': codeBlock },
    };
    this.setState({ isFirstEdit: false, editMode: false });
    editor.setNodeByKey(node.key, properties);
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
    const { attributes, editor, node } = this.props;
    const { editMode } = this.state;
    const { model } = getInfoFromNode(node);

    const removeCodeblock = (
      <Button stripped onClick={this.handleRemove}>
        <Cross />
      </Button>
    );

    return (
      <CodeDiv
        className="c-figure"
        draggable={!editMode}
        onClick={this.toggleEditMode}
        role="button"
        {...attributes}>
        <Codeblock
          actionButton={removeCodeblock}
          code={model.code}
          format={model.format}
          title={model.title}
        />
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
      </CodeDiv>
    );
  }
}

CodeBlock.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(CodeBlock);
