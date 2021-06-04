import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Block, Document, Element, Inline, Node } from 'slate';
import he from 'he';

import Button from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import { Codeblock } from '@ndla/code';

import { getSchemaEmbed } from '../../editorSchema';
import { CodeBlockType } from '../../../../interfaces';
import EditCodeBlock from './EditCodeBlock';
import { RenderElementProps } from 'slate-react';
import { CodeblockElement } from '.';

type ParentNode = Document | Block | Inline;

const CodeDiv = styled.div`
  cursor: pointer;
`;

interface Props {
  editor: Editor;
}

interface RemoveCodeBlockProps {
  handleRemove: () => void;
}

const RemoveCodeBlock = ({ handleRemove }: RemoveCodeBlockProps) => {
  return (
    <Button stripped onClick={handleRemove}>
      <DeleteForever />
    </Button>
  );
};

const getInfoFromNode = (element: CodeblockElement) => {
  const { data } = element;
  const codeBlock = data['code-block'] || Node.string(element);

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

const CodeBlock = ({ attributes, editor, element }: Props & RenderElementProps) => {
  const { isFirstEdit, model } = getInfoFromNode(element as CodeblockElement);
  const [editMode, setEditMode] = useState<boolean>(!model.code);
  const [firstEdit, setFirstEdit] = useState<boolean>(isFirstEdit);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = (codeBlock: CodeBlockType) => {
    const { code } = codeBlock;
    const properties = {
      data: {
        ...getSchemaEmbed(element),
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
