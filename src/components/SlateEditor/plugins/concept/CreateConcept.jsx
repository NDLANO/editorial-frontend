import React from 'react';
import PropTypes from 'prop-types';
import Notion from '@ndla/notion';

import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';

import { getLocale } from '../../../../modules/locale/locale';
import ConceptModal from './ConceptModal';

class EditConcept extends React.PureComponent {
  constructor() {
    super();
    this.state = { concept: {}, conceptModalOpen: false };
    this.getConcept = this.getConcept.bind(this);
    this.toggleConceptModal = this.toggleConceptModal.bind(this);
  }

  componentDidMount() {
    this.setState({ accessToken: localStorage.getItem('access_token') });
  }

  toggleConceptModal(e) {
    e && e.preventDefault();
    this.setState(prevState => ({
      conceptModalOpen: !prevState.conceptModalOpen,
    }));
  }

  render() {
    const { concept, linkText, conceptModalOpen, accessToken } = this.state;
    return (
      <>
        <span onMouseDown={this.toggleConceptModal}>
          <Notion id={concept.id}>{linkText}</Notion>
        </span>
        {conceptModalOpen && (
          <ConceptModal
            id={concept.id}
            accessToken={accessToken}
            onClose={this.toggleConceptModal}
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
