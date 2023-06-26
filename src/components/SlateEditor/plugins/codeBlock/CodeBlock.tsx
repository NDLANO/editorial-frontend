import { useState } from 'react';
import styled from '@emotion/styled';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import he from 'he';
import { useTranslation } from 'react-i18next';

import { IconButtonV2 } from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { Codeblock } from '@ndla/code';
import { CodeEmbedData } from '@ndla/types-embed';

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
  const { t } = useTranslation();
  return (
    <IconButtonV2
      variant="ghost"
      colorTheme="danger"
      aria-label={t('form.remove')}
      onClick={handleRemove}
    >
      <DeleteForever />
    </IconButtonV2>
  );
};

const getInfoFromNode = (element: CodeblockElement): CodeEmbedData => {
  const { data } = element;
  return {
    resource: 'code-block',
    codeContent: he.decode(data.codeContent || '') as string,
    title: data.title || '',
    codeFormat: data.codeFormat || 'text',
  };
};

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const embedData = getInfoFromNode(element);
  const [editMode, setEditMode] = useState<boolean>(!embedData.codeContent && !embedData.title);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = (codeBlock: CodeBlockType) => {
    const newData: CodeEmbedData = {
      resource: 'code-block',
      codeFormat: codeBlock.format,
      title: codeBlock.title,
      codeContent: codeBlock.code,
    };
    const properties = {
      data: newData,
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
    <>
      <CodeDiv
        className="c-figure"
        contentEditable={false}
        draggable={!editMode}
        onClick={toggleEditMode}
        role="button"
        {...attributes}
      >
        <Codeblock
          actionButton={<RemoveCodeBlock handleRemove={handleRemove} />}
          code={embedData.codeContent}
          format={embedData.codeFormat}
          title={embedData.title}
        />
        {children}
      </CodeDiv>
      {editMode && (
        <EditCodeBlock
          editor={editor}
          onChange={editor.onChange}
          closeDialog={onExit}
          handleSave={handleSave}
          embedData={embedData}
          onExit={onExit}
        />
      )}
    </>
  );
};

export default CodeBlock;
