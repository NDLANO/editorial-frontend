import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Block, Document, Inline, Node } from 'slate';
import he from 'he';

import Button from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import { Codeblock, getTitleFromFormat } from '@ndla/code';

import { getSchemaEmbed } from '../../editorSchema';
import { CodeBlockType, CodeBlockProps } from '../../../../interfaces';
import EditCodeBlock from './EditCodeBlock';

type ParentNode = Document | Block | Inline;

const CodeDiv = styled.div`
  cursor: pointer;
`;

interface RemoveCodeBlockProps {
  handleRemove: () => void;
}

const RemoveCodeBlock: React.FC<RemoveCodeBlockProps> = ({ handleRemove }) => {
  return (
    <Button stripped onClick={handleRemove}>
      <Cross />
    </Button>
  );
};

const getInfoFromNode = (node: Node) => {
  const data = (node as ParentNode)?.data?.toJS() || {};
  const codeBlock = data['code-block'] || node.text;

  const code = codeBlock.code || data['code-content'] || '';
  const format = codeBlock.format || data['code-format'] || 'text';
  const title = codeBlock.title || data['title'] || '';

  return {
    model: {
      code: he.decode(code),
      title,
      format,
    },
    isFirstEdit: data['code-block'] === undefined,
  };
};

const CodeBlock: React.FC<CodeBlockProps> = ({ attributes, editor, node }) => {
  const { isFirstEdit, model } = getInfoFromNode(node);
  const [editMode, setEditMode] = useState<boolean>(!model.code);
  const [firstEdit, setFirstEdit] = useState<boolean>(isFirstEdit);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = (codeBlock: CodeBlockType) => {
    const { code } = codeBlock;
    const properties = {
      data: {
        ...getSchemaEmbed(node),
        title: codeBlock.title,
        'code-block': { ...codeBlock, code: he.encode(code) },
      },
    };
    setEditMode(false);
    setFirstEdit(false);
    editor.setNodeByKey(node.key, properties);
  };

  const handleRemove = () => {
    editor.removeNodeByKey(node.key);
    editor.focus();
  };

  const handleUndo = () => {
    editor.unwrapBlockByKey(node.key, 'code-block');
    editor.focus();
  };

  const onExit = () => {
    setEditMode(false);
    if (firstEdit) {
      handleUndo();
    }
  };

  return (
    <CodeDiv
      className="c-figure"
      draggable={!editMode}
      onClick={toggleEditMode}
      role="button"
      {...attributes}>
      <Codeblock
        actionButton={<RemoveCodeBlock handleRemove={handleRemove} />}
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

export default injectT(CodeBlock);
