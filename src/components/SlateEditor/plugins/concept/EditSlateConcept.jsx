/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import Notion from '@ndla/notion';
import PropTypes from 'prop-types';
import { TYPE } from '.';
import ConceptModal from './ConceptModal';
import SlateConceptPreview from './SlateConceptPreview';
import { useFetchConceptData } from '../../../../containers/FormikForm/formikConceptHooks';

const getConceptDataAttributes = ({ id, title: { title } }) => ({
  type: TYPE,
  data: {
    'content-id': id,
    'link-text': title,
    resource: 'concept',
    type: 'inline',
  },
});

const EditSlateConcept = props => {
  const { t, children, node, locale, editor, attributes } = props;
  const nodeText = node.text.trim();

  const [showConcept, setShowConcept] = useState(false);

  const toggleConceptModal = evt => {
    if (evt) {
      evt.preventDefault();
    }
    setShowConcept(!showConcept);
  };

  const { concept, subjects, ...conceptHooks } = useFetchConceptData(
    node.data.get('content-id'),
    locale,
  );
  const conceptId = concept && concept.id ? concept.id : undefined;

  const handleChangeAndClose = editor => {
    editor.focus(); // Always return focus to editor
    toggleConceptModal();
  };

  const addConcept = addedConcept => {
    const data = getConceptDataAttributes({
      ...addedConcept,
      title: { title: nodeText },
    });
    if (node.key) {
      handleChangeAndClose(editor.moveToRangeOfNode(node).setInlines(data));
    }
  };

  const handleRemove = () => {
    const nextValue = editor
      .moveToRangeOfNode(node)
      .removeNodeByKey(node.key)
      .insertText(node.text);
    handleChangeAndClose(nextValue);
  };

  const onClose = () => {
    if (!node.data.get('content-id')) {
      handleRemove();
    } else {
      handleChangeAndClose(editor);
    }
  };

  useEffect(() => {
    if (!node.data.get('content-id')) {
      setShowConcept(true);
    }
  }, [node]);

  return (
    <span>
      <span {...attributes} onMouseDown={toggleConceptModal}>
        {conceptId ? (
          <Notion
            id={conceptId}
            title={concept.title}
            subTitle={t('conceptform.title')}
            content={
              <SlateConceptPreview
                concept={concept}
                handleRemove={handleRemove}
                id={conceptId}
                onClose={onClose}
                locale={locale}
              />
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

EditSlateConcept.propTypes = {
  node: PropTypes.shape({
    data: PropTypes.any,
    key: PropTypes.string,
    text: PropTypes.string,
  }),
  locale: PropTypes.string,
  editor: PropTypes.object,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default injectT(EditSlateConcept);
