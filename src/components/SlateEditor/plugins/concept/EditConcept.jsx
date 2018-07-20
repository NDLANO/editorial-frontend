import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { injectT } from 'ndla-i18n';
import { getLocale } from '../../../../modules/locale/locale';
import { fetchConcept } from '../../../../modules/article/articleApi';

const classes = new BEMHelper({
  name: 'concept',
  prefix: 'c-',
});

class EditConcept extends React.PureComponent {
  constructor() {
    super();
    this.state = { concept: {} };
    this.getConcept = this.getConcept.bind(this);
    this.openEditConcept = this.openEditConcept.bind(this);
  }

  componentDidMount() {
    this.getConcept();
  }

  async getConcept() {
    const { node, locale } = this.props;
    const concept = await fetchConcept(node.data.get('content-id'), locale);
    this.setState({ concept, linkText: node.data.get('link-text') });
  }

  /*  eslint-disable */
  openEditConcept(e) {
    e.preventDefault();
  } /* eslint-enable */

  render() {
    const { concept, linkText } = this.state;
    return (
      <button
        {...classes('link')}
        onClick={this.openEditConcept}
        id={concept.id}>
        {linkText}
      </button>
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
