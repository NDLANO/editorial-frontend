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
import { useFetchConceptData } from '../../../../containers/FormikForm/formikConceptHooks';

const getConceptDataAttributes = ({ id, title: { title } }) => ({
  type: TYPE,
  data: {
    'content-id': id,
    'link-text': title,
    resource: 'concept',
  },
});

const EditSlateConcept = props => {
  const { t, children, node, locale, editor, attributes } = props;

  const [isModalOpen, toggleIsModalOpen] = useState(false);
  const { concept, ...conceptHooks } = useFetchConceptData(
    node.data.get('content-id'),
    locale,
  );

  useEffect(() => {
    if (!node.data.get('content-id')) {
      toggleIsModalOpen(true);
    }
  }, []);

  const conceptId = concept && concept.id ? concept.id : undefined;

  const handleChangeAndClose = editor => {
    editor.focus(); // Always return focus to editor
    toggleConceptModal();
  };

  const addConcept = addedConcept => {
    const data = getConceptDataAttributes(addedConcept);
    if (node.key) {
      handleChangeAndClose(
        editor
          .moveToRangeOfNode(node)
          .insertText(addedConcept.title.title)
          .setInlines(data),
      );
    }
  };

  const toggleConceptModal = evt => {
    if (evt) {
      evt.preventDefault();
    }
    toggleIsModalOpen(!isModalOpen);
  };

  return (
    <span>
      <span {...attributes} onMouseDown={toggleConceptModal}>
        {conceptId ? (
          <Notion
            id={conceptId}
            title={concept.title}
            ariaLabel={t('notions.edit')}>
            {children}
          </Notion>
        ) : (
          children
        )}
      </span>
      {isModalOpen && (
        <ConceptModal
          id={conceptId}
          onClose={toggleConceptModal}
          addConcept={addConcept}
          locale={locale}
          concept={concept}
          selectedText={node.text}
          {...conceptHooks}
        />
      )}
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
