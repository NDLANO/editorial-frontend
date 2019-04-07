import React from 'react';
import PropTypes from 'prop-types';
import Notion from '@ndla/notion';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import {
  getAccessToken,
  isAccessTokenValid,
  renewAuth,
} from '../../../../util/authHelpers';
import { getLocale } from '../../../../modules/locale/locale';
import { fetchConcept } from '../../../../modules/article/articleApi';
import ConceptModal from './ConceptModal';
import handleError from '../../../../util/handleError';
import config from '../../../../config';

const setConceptDataAttributes = ({ conceptId, text }) => ({
  data: {
    'content-id': conceptId,
    'link-text': text,
    resource: 'concept',
  },
});

class EditConcept extends React.PureComponent {
  constructor() {
    super();
    this.state = { concept: {}, conceptModalOpen: false };
    this.getConcept = this.getConcept.bind(this);
    this.toggleConceptModal = this.toggleConceptModal.bind(this);
    this.AddNewConcept = this.AddNewConcept.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    const conceptId = this.props.node.data.get('content-id');
    if (conceptId) {
      this.getConcept(conceptId);
    } else {
      this.setState({ conceptModalOpen: true, createConcept: true });
    }
    this.getToken();
  }

  componentDidUpdate(prevProps) {
    if (!isAccessTokenValid()) {
      this.getToken();
    }
    if (prevProps.node.data.get('content-id')) return;
    const conceptId = this.props.node.data.get('content-id');
    if (conceptId) {
      this.getConcept(conceptId);
      this.setState({ conceptModalOpen: false });
    }
  }

  async getToken() {
    if (!isAccessTokenValid()) {
      await renewAuth();
    }
    this.setState({
      accessToken: getAccessToken(),
    });
  }

  async getConcept(conceptId) {
    const { node, locale } = this.props;
    try {
      const { data: concept } = await fetchConcept(conceptId, locale);
      this.setState({ concept, linkText: node.data.get('link-text') });
    } catch (err) {
      handleError(err);
    }
  }

  AddNewConcept({ data, origin }) {
    if (origin !== config.explanationFrontendDomain || !data) {
      return;
    }
    const { conceptId } = data;
    const {
      node: { key, text },
      editor,
    } = this.props;
    if (conceptId) {
      editor.setNodeByKey(key, setConceptDataAttributes({ conceptId, text }));
    }
  }

  toggleConceptModal(evt) {
    evt && evt.preventDefault();
    const { node, editor } = this.props;
    this.setState(prevState => ({
      conceptModalOpen: !prevState.conceptModalOpen,
    }));
    if (!node.data.get('content-id')) {
      editor.removeNodeByKey(node.key).insertText(node.text);
    }
  }

  render() {
    const {
      concept,
      linkText,
      conceptModalOpen,
      accessToken,
      createConcept,
    } = this.state;
    const { t, children, node } = this.props;
    const name = createConcept && node.text;
    return (
      <>
        <span {...this.props.attributes} onMouseDown={this.toggleConceptModal}>
          {concept.id ? (
            <Notion
              id={concept.id}
              title={concept.title ? concept.title.title : ''}
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
            accessToken={accessToken}
            onClose={this.toggleConceptModal}
            handleMessage={this.AddNewConcept}
            name={name}
          />
        )}
      </>
    );
  }
}

EditConcept.propTypes = {
  node: PropTypes.shape({
    data: PropTypes.any,
  }),
  locale: PropTypes.string,
  editor: PropTypes.object,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(EditConcept));
