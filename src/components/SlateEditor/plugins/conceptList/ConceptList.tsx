import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { ReactNode, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, ReactEditor, useSelected } from 'slate-react';
import { ConceptListElement } from '.';
import ConceptSearchResult from './ConceptSearchResult';
import ConceptTagPicker from './ConceptTagPicker';

interface Props {
  element: ConceptListElement;
  language: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const StyledWrapper = styled.div<{ isSelected: boolean }>`
  padding: 5px;
  border: ${p =>
    p.isSelected ? `2px solid ${colors.brand.primary}` : `2px dashed ${colors.brand.greyLighter}`};
`;

const ConceptList = ({ element, language, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(!!element.isFirstEdit);
  const isSelected = useSelected();
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
      <StyledWrapper {...attributes} contentEditable={false} isSelected={isSelected}>
        {title && <h2>{title}</h2>}
        {tag && <ConceptSearchResult tag={tag} language={language} />}
        {children}
      </StyledWrapper>
      <ConceptTagPicker element={element} isOpen={editMode} onClose={onClose} language={language} />
    </>
  );
};

export default ConceptList;
