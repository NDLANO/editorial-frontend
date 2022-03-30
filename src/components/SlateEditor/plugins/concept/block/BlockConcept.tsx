/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode } from 'react';
import { colors } from '@ndla/core';
import { Editor, Element, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { Dictionary } from 'lodash';
import styled from '@emotion/styled';
import { IConcept } from '@ndla/types-concept-api';
import ConceptModal from '../ConceptModal';
import SlateConceptPreview from '../SlateConceptPreview';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import mergeLastUndos from '../../../utils/mergeLastUndos';
import { TYPE_CONCEPT_BLOCK } from './types';
import { ConceptBlockElement } from './interfaces';

const getConceptDataAttributes = ({ id }: Dictionary<any>) => ({
  type: TYPE_CONCEPT_BLOCK,
  data: {
    'content-id': id,
    resource: 'concept',
    type: 'block',
  },
});

interface Props {
  element: ConceptBlockElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const StyledWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  white-space: normal;
  ul {
    margin-top: 0;
  }
  box-shadow: ${p => (p.isSelected ? `${colors.brand.primary} 0 0 0 2px` : 'none')};
`;

const BlockConcept = ({ element, locale, editor, attributes, children }: Props) => {
  const isSelected = useSelected();

  const [showConcept, setShowConcept] = useState(false);

  const { concept, subjects, ...conceptHooks } = useFetchConceptData(
    parseInt(element.data['content-id']),
    locale,
  );
  const conceptId = concept && concept.id ? concept.id : undefined;

  const handleSelectionChange = (isNewConcept: boolean) => {
    ReactEditor.focus(editor);
    if (isNewConcept) {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: 'start' });
    } else {
      Transforms.select(editor, ReactEditor.findPath(editor, element));
    }
  };

  const addConcept = (addedConcept: IConcept) => {
    setShowConcept(false);
    setTimeout(() => {
      handleSelectionChange(true);
      const data = getConceptDataAttributes(addedConcept);
      if (element && true) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(
          editor,
          { data: data.data },
          { at: path, match: node => Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK },
        );
        mergeLastUndos(editor);
      }
    }, 0);
  };

  const handleRemove = () => {
    setShowConcept(false);
    setTimeout(() => {
      handleSelectionChange(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.removeNodes(editor, {
        at: path,
        match: node => Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK,
      });
    }, 0);
  };

  const onClose = () => {
    if (!element.data['content-id']) {
      handleRemove();
    } else {
      setShowConcept(false);
      handleSelectionChange(false);
    }
  };

  useEffect(() => {
    if (!element.data['content-id']) {
      setShowConcept(true);
    }
  }, [element]);

  return (
    <StyledWrapper {...attributes} tabIndex={1} isSelected={isSelected} draggable={true}>
      {concept && (
        <div contentEditable={false}>
          <SlateConceptPreview
            concept={concept}
            handleRemove={handleRemove}
            id={concept.id}
            isBlockView
          />
        </div>
      )}
      <ConceptModal
        id={conceptId}
        isOpen={!conceptId && showConcept}
        onClose={onClose}
        addConcept={addConcept}
        locale={locale}
        concept={concept}
        subjects={subjects}
        handleRemove={handleRemove}
        selectedText={''}
        {...conceptHooks}
      />
      {children}
    </StyledWrapper>
  );
};

export default BlockConcept;
