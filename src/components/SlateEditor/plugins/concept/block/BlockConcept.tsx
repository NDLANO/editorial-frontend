/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode } from 'react';
import { colors } from '@ndla/core';
import { Editor, Element, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import styled from '@emotion/styled';
import { IConcept, IConceptSummary } from '@ndla/types-concept-api';
import ConceptModal from '../ConceptModal';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import mergeLastUndos from '../../../utils/mergeLastUndos';
import { TYPE_CONCEPT_BLOCK } from './types';
import { ConceptBlockElement } from './interfaces';
import BlockConceptPreview from './BlockConceptPreview';
import { Dictionary } from '../../../../../interfaces';

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
  padding: 5px;
  border: ${(p) =>
    p.isSelected ? `2px solid ${colors.brand.primary}` : `2px dashed ${colors.brand.greyLighter}`};
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

  const addConcept = (addedConcept: IConceptSummary | IConcept) => {
    setShowConcept(false);
    setTimeout(() => {
      handleSelectionChange(true);
      const data = getConceptDataAttributes(addedConcept);
      if (element && true) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(
          editor,
          { data: data.data },
          {
            at: path,
            match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK,
          },
        );

        // Insertion of concept consists of insert an empty concept and then updating it with an ID. By merging the events we can consider them as one action and undo both with ctrl+z.
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
        match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK,
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
    <StyledWrapper
      {...attributes}
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      tabIndex={1}
      isSelected={isSelected}
      draggable={true}
      className="c-figure u-float"
    >
      {concept && (
        <div contentEditable={false}>
          <BlockConceptPreview
            concept={concept}
            handleRemove={handleRemove}
            id={concept.id}
            isBlockView
          />
        </div>
      )}
      <ConceptModal
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
