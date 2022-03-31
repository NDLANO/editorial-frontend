import { ReactNode, useState } from 'react';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { ConceptListElement } from '.';
import ConceptTagSearch from './ConceptTagSearch';

interface Props {
  element: ConceptListElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const ConceptList = ({ element, locale, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState(!!element.startEditMode);

  const onClose = () => {
    setEditMode(false);
  };

  return (
    <>
      <div {...attributes}>{children}</div>
      <ConceptTagSearch element={element} isOpen={editMode} onClose={onClose} />
    </>
  );
};

export default ConceptList;
