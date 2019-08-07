/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Notion from '@ndla/notion';
import { fetchConcept } from '../../../../modules/article/articleApi';
import handleError from '../../../../util/handleError';
import ConceptModal from './ConceptModal';

const setConceptDataAttributes = ({ conceptId, text }) => ({
  data: {
    'content-id': conceptId,
    'link-text': text,
    resource: 'concept',
  },
});

class EditConcept extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { concept: {}, conceptModalOpen: false };
  }

  componentDidMount() {
    const conceptId = this.props.node.data.get('content-id');
    if (conceptId) {
      this.getConcept(conceptId);
    } else {
      this.setState({ conceptModalOpen: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.node.data.get('content-id')) return;
    const conceptId = this.props.node.data.get('content-id');
    if (conceptId) {
      this.getConcept(conceptId);
      this.setState({ conceptModalOpen: false });
    }
  }

  getConcept = async conceptId => {
    const { node, locale } = this.props;
    try {
      const { data: concept } = await fetchConcept(conceptId, locale);
      this.setState({ concept, linkText: node.data.get('link-text') });
    } catch (err) {
      handleError(err);
    }
  };

  addNewConcept = ({ data }) => {
    const { conceptId } = data;
    const {
      node: { key, text },
      editor,
    } = this.props;
    if (conceptId) {
      editor.setNodeByKey(key, setConceptDataAttributes({ conceptId, text }));
    }
  };

  toggleConceptModal = evt => {
    evt && evt.preventDefault();
    const { node, editor } = this.props;
    this.setState(prevState => ({
      conceptModalOpen: !prevState.conceptModalOpen,
    }));
    if (!node.data.get('content-id')) {
      editor.removeNodeByKey(node.key).insertText(node.text);
    }
  };

  render() {
    const { concept, linkText, conceptModalOpen } = this.state;

    const { t, children, node, locale } = this.props;

    return (
      <>
        <span {...this.props.attributes} onMouseDown={this.toggleConceptModal}>
          {concept.id ? (
            <Notion
              id={concept.id}
              title={concept.title}
              ariaLabel={t('notions.edit')}>
              {linkText}
            </Notion>
          ) : (
            children
          )}
        </span>
        {conceptModalOpen && (
          <ConceptModal
            id={concept.id}
            onClose={this.toggleConceptModal}
            handleMessage={this.addNewConcept}
            locale={locale}
            type="concept"
            selectedText={node.text}
          />
        )}
      </>
    );
  }
}

EditConcept.propTypes = {
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

export default injectT(EditConcept);
