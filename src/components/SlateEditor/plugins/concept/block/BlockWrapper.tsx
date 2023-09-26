/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { colors } from '@ndla/core';
import { Editor, Element, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import styled from '@emotion/styled';
import { IConcept, IConceptSummary } from '@ndla/types-backend/concept-api';
import { ConceptEmbedData } from '@ndla/types-embed';
import { Modal, ModalContent } from '@ndla/modal';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from './types';
import { ConceptBlockElement } from './interfaces';
import ConceptModalContent from '../ConceptModalContent';
import SlateBlockConcept from './SlateBlockConcept';
import SlateBlockGloss from './SlateBlockGloss';

const getConceptDataAttributes = ({ id }: IConceptSummary | IConcept): ConceptEmbedData => ({
  contentId: id.toString(),
  resource: 'concept',
  type: 'block',
  linkText: '',
});

interface Props {
  element: ConceptBlockElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const StyledWrapper = styled.div`
  position: relative;
  white-space: normal;
  ul {
    margin-top: 0;
  }
  padding: 5px;

  border: 2px dashed ${colors.brand.greyLighter};

  &[data-solid-border='true'] {
    border: 2px solid ${colors.brand.primary};
  }
`;

const BlockWrapper = ({ element, locale, editor, attributes, children }: Props) => {
  const isSelected = useSelected();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { concept, subjects, ...conceptHooks } = useFetchConceptData(
    parseInt(element.data.contentId),
    locale,
  );

  const addConcept = useCallback(
    (addedConcept: IConceptSummary | IConcept) => {
      setIsEditing(false);
      const data = getConceptDataAttributes(addedConcept);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data },
        {
          at: path,
          match: (node) =>
            Element.isElement(node) &&
            (node.type === TYPE_CONCEPT_BLOCK || node.type === TYPE_GLOSS_BLOCK),
        },
      );
    },
    [setIsEditing, editor, element],
  );

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true }),
    [editor, element],
  );

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setIsEditing(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <StyledWrapper
        {...attributes}
        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
        tabIndex={1}
        data-solid-border={isSelected}
        draggable={true}
        className="c-figure u-float"
      >
        {concept && (
          <div contentEditable={false}>
            {concept?.conceptType === 'concept' && (
              <SlateBlockConcept concept={concept} handleRemove={handleRemove} isBlockView />
            )}
            {concept?.conceptType === 'gloss' && (
              <SlateBlockGloss concept={concept} handleRemove={handleRemove} />
            )}
          </div>
        )}
        <ModalContent size={{ width: 'large', height: 'large' }}>
          <ConceptModalContent
            onClose={onClose}
            addConcept={addConcept}
            locale={locale}
            concept={concept}
            subjects={subjects}
            handleRemove={handleRemove}
            selectedText={''}
            isGloss={element.type === TYPE_GLOSS_BLOCK}
            {...conceptHooks}
          />
        </ModalContent>
        {children}
      </StyledWrapper>
    </Modal>
  );
};

export default BlockWrapper;
