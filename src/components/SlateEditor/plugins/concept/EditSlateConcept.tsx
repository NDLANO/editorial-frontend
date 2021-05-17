/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Notion from '@ndla/notion';
import PropTypes from 'prop-types';
import { ConceptElement, TYPE_CONCEPT } from '.';
import ConceptModal from './ConceptModal';
import SlateConceptPreview from './SlateConceptPreview';
import { useFetchConceptData } from '../../../../containers/FormikForm/formikConceptHooks';
import { Editor, Element, Node, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ConceptFormType } from '../../../../interfaces';

const getConceptDataAttributes = ({ id, title: { title } }) => ({
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
  attributes: {
    'data-key': string;
  };
  children: ReactNode;
}

const EditSlateConcept = (props: Props & tType) => {
  const { t, children, element, locale, editor, attributes } = props;
  const nodeText = Node.string(element).trim();

  const [showConcept, setShowConcept] = useState(false);

  const toggleConceptModal = (evt?: React.MouseEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    setShowConcept(!showConcept);
  };

  const { concept, subjects, ...conceptHooks } = useFetchConceptData(
    parseInt(element.data['content-id']),
    locale,
  );
  const conceptId = concept && concept.id ? concept.id : undefined;

  const handleChangeAndClose = (editor: Editor) => {
    ReactEditor.focus(editor); // Always return focus to editor
    toggleConceptModal();
  };

  const addConcept = (addedConcept: ConceptFormType) => {
    const data = getConceptDataAttributes({
      ...addedConcept,
      title: { title: nodeText },
    });
    if (element) {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data: data.data },
        { at: path, match: node => Element.isElement(node) && node.type === TYPE_CONCEPT },
      );
      handleChangeAndClose(editor);
    }
  };

  const handleRemove = () => {
    const path = ReactEditor.findPath(editor, element);

    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_CONCEPT,
    });
    handleChangeAndClose(editor);
  };

  const onClose = () => {
    if (!element.data['content-id']) {
      handleRemove();
    } else {
      handleChangeAndClose(editor);
    }
  };

  useEffect(() => {
    if (!element.data['content-id']) {
      setShowConcept(true);
    }
  }, [element]);

  return (
    <span>
      <span {...attributes} onMouseDown={toggleConceptModal}>
        {conceptId && concept ? (
          <Notion
            id={conceptId}
            title={concept.title}
            subTitle={t('conceptform.title')}
            content={
              <SlateConceptPreview concept={concept} handleRemove={handleRemove} id={conceptId} />
            }
            ariaLabel={t('notions.edit')}>
            {children}
          </Notion>
        ) : (
          children
        )}
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
    </span>
  );
};

export default injectT(EditSlateConcept);
