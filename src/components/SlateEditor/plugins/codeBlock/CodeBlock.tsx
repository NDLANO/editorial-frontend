import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Node, Editor, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import he from 'he';

import Button from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import { Codeblock } from '@ndla/code';

import { CodeBlockType } from '../../../../interfaces';
import EditCodeBlock from './EditCodeBlock';
import { CodeblockElement } from '.';

const CodeDiv = styled.div`
  cursor: pointer;
`;

interface Props extends RenderElementProps {
  element: CodeblockElement;
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

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const { isFirstEdit, model } = getInfoFromNode(element);
  const [editMode, setEditMode] = useState<boolean>(!model.code && !model.title);
  const [firstEdit, setFirstEdit] = useState<boolean>(isFirstEdit);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = (codeBlock: CodeBlockType) => {
    const { code } = codeBlock;
    const properties = {
      data: {
        ...element.data,
        'code-block': { ...codeBlock, code: he.encode(code) },
      },
    };

    setEditMode(false);
    setFirstEdit(false);
    Transforms.setNodes(editor, properties, { at: ReactEditor.findPath(editor, element) });
  };

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const handleUndo = () => {
    Transforms.unwrapNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
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
      contentEditable={false}
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
          editor={editor}
          onChange={editor.onChange}
          closeDialog={toggleEditMode}
          handleSave={handleSave}
          model={model}
          onExit={onExit}
        />
      )}
      {children}
    </CodeDiv>
  );
};

export default injectT(CodeBlock);
