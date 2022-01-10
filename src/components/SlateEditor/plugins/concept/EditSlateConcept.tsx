/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode, useMemo } from 'react';

import { Editor, Element, Node, Transforms, Path } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { Dictionary, uniqueId } from 'lodash';
import Notion from '@ndla/notion';
import { ConceptElement, TYPE_CONCEPT } from '.';
import ConceptModal from './ConceptModal';
import SlateConceptPreview from './SlateConceptPreview';
import { useFetchConceptData } from '../../../../containers/FormikForm/formikConceptHooks';
import mergeLastUndos from '../../utils/mergeLastUndos';
import { ConceptApiType } from '../../../../modules/concept/conceptApiInterfaces';

const getConceptDataAttributes = ({ id, title: { title } }: Dictionary<any>) => ({
  type: TYPE_CONCEPT,
  data: {
    'content-id': id,
    'link-text': title,
    resource: 'concept',
    type: 'inline',
  },
});

interface Props {
  element: ConceptElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const EditSlateConcept = (props: Props) => {
  const { children, element, locale, editor, attributes } = props;
  const nodeText = Node.string(element).trim();

  const uuid = useMemo(() => uniqueId(), []);

  const { t } = useTranslation();

  const [showConcept, setShowConcept] = useState(false);

  const toggleConceptModal = () => {
    setShowConcept(!showConcept);
  };

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

  const addConcept = (addedConcept: ConceptApiType) => {
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
          { at: path, match: node => Element.isElement(node) && node.type === TYPE_CONCEPT },
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
        match: node => Element.isElement(node) && node.type === TYPE_CONCEPT,
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
      <span {...attributes} onClick={toggleConceptModal}>
        <Notion
          id={uuid}
          title={concept?.title.title}
          subTitle={t('conceptform.title')}
          content={
            concept && (
              <SlateConceptPreview concept={concept} handleRemove={handleRemove} id={concept.id} />
            )
          }
          ariaLabel={t('notions.edit')}>
          {children}
        </Notion>
      </span>
      <ConceptModal
        id={conceptId}
        isOpen={!conceptId && showConcept}
        onClose={onClose}
        addConcept={addConcept}
        locale={locale}
        concept={concept}
        subjects={subjects}
        handleRemove={handleRemove}
        selectedText={nodeText}
        {...conceptHooks}
      />
    </>
  );
};

export default EditSlateConcept;
