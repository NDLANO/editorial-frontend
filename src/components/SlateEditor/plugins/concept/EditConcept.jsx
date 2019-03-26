import React from 'react';
import PropTypes from 'prop-types';
import Notion from '@ndla/notion';

import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';

import { getLocale } from '../../../../modules/locale/locale';
import { fetchConcept } from '../../../../modules/article/articleApi';
import ConceptModal from './ConceptModal';

class EditConcept extends React.PureComponent {
  constructor() {
    super();
    this.state = { concept: {}, conceptModalOpen: false };
    this.getConcept = this.getConcept.bind(this);
    this.toggleConceptModal = this.toggleConceptModal.bind(this);
    this.AddNewConcept = this.AddNewConcept.bind(this);
  }

  componentDidMount() {
    if (this.props.node.data.get('content-id')) {
      this.getConcept();
    } else {
      this.setState({ conceptModalOpen: true, createConcept: true });
    }
    this.setState({ accessToken: localStorage.getItem('access_token') });
  }

  async getConcept() {
    const { node, locale } = this.props;
    const concept = await fetchConcept(node.data.get('content-id'), locale);
    this.setState({ concept, linkText: node.data.get('link-text') });
  }

  AddNewConcept(id) {
    console.log('Adding new concept');
    console.log(id);
  }

  toggleConceptModal(e) {
    e && e.preventDefault();
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
            <Notion id={concept.id} ariaLabel={t('notions.edit')}>
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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(EditConcept));
