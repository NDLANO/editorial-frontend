import { ReactNode, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, ReactEditor } from 'slate-react';
import { ConceptListElement } from '.';
import ConceptSearchResult from './ConceptSearchResult';
import ConceptTagSearch from './ConceptTagSearch';

interface Props {
  element: ConceptListElement;
  language: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const ConceptList = ({ element, language, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(!!element.isFirstEdit); // Temp. Remove true

  const onClose = () => {
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: [], match: node => element === node });
    }
    setEditMode(false);
  };

  const { tag, title } = element.data;

  return (
    <>
      <div {...attributes} contentEditable={false}>
        {title && <h2>{title}</h2>}
        {tag && <ConceptSearchResult tag={tag} language={language} />}
        {children}
      </div>
      <ConceptTagSearch element={element} isOpen={editMode} onClose={onClose} language={language} />
    </>
  );
};

export default ConceptList;
