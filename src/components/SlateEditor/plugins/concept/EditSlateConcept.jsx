/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { injectT } from '@ndla/i18n';
import Notion from '@ndla/notion';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TYPE } from '.';
import ConceptModal from './ConceptModal';
import { useFetchConceptData } from '../../../../containers/FormikForm/formikConceptHooks';

/*componentDidMount() {
  const conceptId = this.props.node.data.get('content-id');
  console.log('id,', conceptId);
  if (conceptId) {
    this.getConcept(conceptId);
  } else {
    this.setState({ isModalOpen: true });
  }
}

componentDidUpdate(prevProps) {
  const conceptId = this.props.node.data.get('content-id');
  if (prevProps.node.data.get('content-id') !== conceptId) {
    this.getConcept(conceptId);
    this.setState({ isModalOpen: false });
  }
}

getConcept = async conceptId => {
  const { locale } = this.props;
  try {
    const concept = await fetchConcept(conceptId, locale);
    this.setState({
      concept: {
        ...concept,
        title: concept.title ? concept.title.title : '',
        content: concept.content ? concept.content.content : '',
      },
    });
  } catch (err) {
    handleError(err);
  }
};*/

const getConceptDataAttributes = ({ id, title: { title } }) => ({
  type: TYPE,
  data: {
    'content-id': id,
    'link-text': title,
    resource: 'concept',
  },
});

const EditSlateConcept = props => {
  const { t, children, node, locale, editor } = props;
  const [isModalOpen, toggleIsModalOpen] = useState(false);
  const { concept, ...conceptHooks } = useFetchConceptData(
    node.data.get('content-id'),
    locale,
  );

  const handleChangeAndClose = editor => {
    editor.focus(); // Always return focus to editor
    toggleConceptModal();
  };

  const addConcept = concept => {
    const data = getConceptDataAttributes(concept);
    if (node.key) {
      handleChangeAndClose(
        editor
          .moveToRangeOfNode(node)
          .insertText(concept.title.title)
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
  console.log(concept);
  return (
    <>
      <span {...props.attributes} onMouseDown={toggleConceptModal}>
        {concept && concept.id ? (
          <Notion
            id={concept.id}
            title={concept.title}
            ariaLabel={t('notions.edit')}>
            {concept.title}
          </Notion>
        ) : (
          children
        )}
      </span>
      {isModalOpen && (
        <ConceptModal
          id={concept.id}
          onClose={toggleConceptModal}
          addConcept={addConcept}
          locale={locale}
          selectedText={node.text}
          {...conceptHooks}
        />
      )}
    </>
  );
};

EditSlateConcept.propTypes = {
  node: PropTypes.shape({
    data: PropTypes.any,
    key: PropTypes.number,
    text: PropTypes.string,
  }),
  locale: PropTypes.string,
  editor: PropTypes.object,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default injectT(EditSlateConcept);
