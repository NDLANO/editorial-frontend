/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode, useMemo } from 'react';

import { Editor, Element, Node, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import uniqueId from 'lodash/uniqueId';
import { IConcept, IConceptSummary } from '@ndla/types-backend/concept-api';
import { ConceptEmbedData } from '@ndla/types-embed';
import { Modal, ModalContent } from '@ndla/modal';
import { ConceptInlineElement } from '../inline/interfaces';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import { TYPE_CONCEPT_INLINE } from './types';
import SlateNotion from './SlateNotion';
import ConceptModalContent from '../ConceptModalContent';

const getConceptDataAttributes = (
  concept: IConcept | IConceptSummary,
  title: string,
): ConceptEmbedData => ({
  contentId: concept.id.toString(),
  linkText: title,
  resource: 'concept',
  type: 'inline',
});

interface Props {
  element: ConceptInlineElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const InlineConcept = (props: Props) => {
  const { children, element, locale, editor, attributes } = props;
  const nodeText = Node.string(element).trim();
  const uuid = useMemo(() => uniqueId(), []);
  const [showConcept, setShowConcept] = useState(false);

  const toggleConceptModal = () => {
    setShowConcept(!showConcept);
  };

  const { concept, subjects, fetchSearchTags, conceptArticles, createConcept, updateConcept } =
    useFetchConceptData(parseInt(element.data.contentId), locale);

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
    toggleConceptModal();
    setTimeout(() => {
      handleSelectionChange(true);
      const data = getConceptDataAttributes(addedConcept, nodeText);
      if (element) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(
          editor,
          { data },
          {
            at: path,
            match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
          },
        );
      }
    }, 0);
  };

  const handleRemove = () => {
    toggleConceptModal();
    setTimeout(() => {
      handleSelectionChange(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
      });
    }, 0);
  };

  const onClose = () => {
    if (!element.data.contentId) {
      handleRemove();
    } else {
      toggleConceptModal();
      handleSelectionChange(false);
    }
  };

  useEffect(() => {
    if (!element.data.contentId) {
      setShowConcept(true);
    }
  }, [element]);

  return (
    <Modal open={!concept?.id && showConcept}>
      <SlateNotion handleRemove={handleRemove} attributes={attributes} concept={concept} id={uuid}>
        {children}
      </SlateNotion>
      <ModalContent size={{ width: 'large', height: 'large' }}>
        <ConceptModalContent
          onClose={onClose}
          addConcept={addConcept}
          locale={locale}
          concept={concept}
          subjects={subjects}
          handleRemove={handleRemove}
          selectedText={nodeText}
          fetchSearchTags={fetchSearchTags}
          createConcept={createConcept}
          updateConcept={updateConcept}
          conceptArticles={conceptArticles}
        />
      </ModalContent>
    </Modal>
  );
};

export default InlineConcept;
