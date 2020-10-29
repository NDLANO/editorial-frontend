import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Node } from 'slate';

import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import { Codeblock, getTitleFromFormat } from '@ndla/code';

import { getSchemaEmbed } from '../../editorSchema';
import { CodeBlockType, SlateFigureProps } from '../../../../interfaces';
import EditCodeBlock from './EditCodeBlock';

const CodeDiv = styled.div`
  cursor: pointer;
`;

// interface Props extends SlateFigureProps {}

const getInfoFromNode = (node: Node) => {
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

// class CodeBlock extends Component {
//   constructor(props) {
//     super(props);
//     const { isFirstEdit, model } = getInfoFromNode(props.node);
//     this.state = { isFirstEdit, editMode: !model.code };
//     this.toggleEditMode = this.toggleEditMode.bind(this);
//     this.handleSave = this.handleSave.bind(this);
//     this.handleRemove = this.handleRemove.bind(this);
//     this.handleUndo = this.handleUndo.bind(this);
//     this.onExit = this.onExit.bind(this);
//   }

const CodeBlock: React.FC<SlateFigureProps> = ({
  attributes,
  editor,
  node,
}) => {
  // const { editMode } = this.state;
  const { isFirstEdit, model } = getInfoFromNode(node);
  const [editMode, setEditMode] = useState<boolean>(!model.code);
  const [firstEdit, setFirstEdit] = useState<boolean>(isFirstEdit);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  }; // TODO: () => void

  const handleSave = (codeBlock: CodeBlockType) => {
    const properties = {
      data: { ...getSchemaEmbed(node), 'code-block': codeBlock },
    };
    setEditMode(false);
    setFirstEdit(false);
    // blir dette rett? this.setState({ isFirstEdit: false, editMode: false });
    editor.setNodeByKey(node.key, properties);
  }; // TODO: (code: CodeBlockType) => void

  const handleRemove = () => {
    editor.removeNodeByKey(node.key);
    editor.focus();
  }; // TODO: () => void

  const handleUndo = () => {
    editor.unwrapBlockByKey(node.key, 'code-block');
    editor.focus();
  }; // TODO: () => void

  const onExit = () => {
    setEditMode(false);
    if (firstEdit) {
      handleUndo();
    }
  }; // TODO: () => void

  const removeCodeblock = () => {
    <Button stripped onClick={handleRemove}>
      <Cross />
    </Button>
  };

  return (
    <CodeDiv
      className="c-figure"
      draggable={!editMode}
      onClick={toggleEditMode}
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
          closeDialog={toggleEditMode}
          handleSave={handleSave}
          model={model}
          onExit={onExit}
        />
      )}
    </CodeDiv>
  );
};

// CodeBlock.propTypes = {
//   attributes: PropTypes.shape({
//     'data-key': PropTypes.string.isRequired,
//   }),
//   editor: EditorShape,
//   node: Types.node.isRequired,
// };

export default injectT(CodeBlock);
