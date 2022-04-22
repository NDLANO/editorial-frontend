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
import { Dictionary, uniqueId } from 'lodash';
import { IConcept } from '@ndla/types-concept-api';
import { ConceptInlineElement } from '../inline/interfaces';
import ConceptModal from '../ConceptModal';
import { useFetchConceptData } from '../../../../../containers/FormikForm/formikConceptHooks';
import mergeLastUndos from '../../../utils/mergeLastUndos';
import { TYPE_CONCEPT_INLINE } from './types';
import SlateNotion from './SlateNotion';

const getConceptDataAttributes = ({ id, title: { title } }: Dictionary<any>) => ({
  type: TYPE_CONCEPT_INLINE,
  data: {
    'content-id': id,
    'link-text': title,
    resource: 'concept',
    type: 'inline',
  },
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

  const {
    concept,
    subjects,
    fetchSearchTags,
    conceptArticles,
    createConcept,
    updateConcept,
    updateConceptAndStatus,
  } = useFetchConceptData(parseInt(element.data['content-id']), locale);

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
    toggleConceptModal();
    setTimeout(() => {
      handleSelectionChange(true);
      const data = getConceptDataAttributes({
        ...addedConcept,
        title: { title: nodeText },
      });
      if (element && true) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(
          editor,
          { data: data.data },
          { at: path, match: node => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE },
        );
        mergeLastUndos(editor);
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
        match: node => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
      });
    }, 0);
  };

  const onClose = () => {
    if (!element.data['content-id']) {
      handleRemove();
    } else {
      toggleConceptModal();
      handleSelectionChange(false);
    }
  };

  useEffect(() => {
    if (!element.data['content-id']) {
      setShowConcept(true);
    }
  }, [element]);

  return (
    <>
      <SlateNotion handleRemove={handleRemove} attributes={attributes} concept={concept} id={uuid}>
        {children}
      </SlateNotion>
      <ConceptModal
        isOpen={!concept?.id && showConcept}
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
        updateConceptAndStatus={updateConceptAndStatus}
      />
    </>
  );
};

export default InlineConcept;
