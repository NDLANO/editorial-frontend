import { useState } from 'react';
import styled from '@emotion/styled';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import he from 'he';

import Button from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
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
  const codeBlock = data['code-block'] || {};

  const code = codeBlock.code || data['code-content'] || '';
  const format = codeBlock.format || data['code-format'] || 'text';
  const title = codeBlock.title || data['title'] || '';

  return {
    model: {
      code: he.decode(code),
      title,
      format,
    },
  };
};

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const { model } = getInfoFromNode(element);
  const [editMode, setEditMode] = useState<boolean>(!model.code && !model.title);

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
      isFirstEdit: false,
    };
    ReactEditor.focus(editor);
    setEditMode(false);
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, properties, { at: path });
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const handleUndo = () => {
    Transforms.unwrapNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onExit = () => {
    ReactEditor.focus(editor);
    setEditMode(false);
    if (element.isFirstEdit) {
      handleUndo();
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
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
          closeDialog={onExit}
          handleSave={handleSave}
          model={model}
          onExit={onExit}
        />
      )}
      {children}
    </CodeDiv>
  );
};

export default CodeBlock;
