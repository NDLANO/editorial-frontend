import { ReactNode, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, ReactEditor } from 'slate-react';
import { ConceptListElement } from '.';
import ConceptTagSearch from './ConceptTagSearch';

interface Props {
  element: ConceptListElement;
  language: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const ConceptList = ({ element, language, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState(!!element.isFirstEdit);

  const onClose = () => {
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: [], match: node => element === node });
    }
    setEditMode(false);
  };

  return (
    <>
      <div {...attributes}>{children}</div>
      <ConceptTagSearch element={element} isOpen={editMode} onClose={onClose} language={language} />
    </>
  );
};

export default ConceptList;
