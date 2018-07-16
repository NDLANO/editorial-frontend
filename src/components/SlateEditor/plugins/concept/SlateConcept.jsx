import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Concept } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { getLocale } from '../../../../modules/locale/locale';
import { fetchConcept } from '../../../../modules/article/articleApi';

class SlateConcept extends React.PureComponent {
  constructor() {
    super();
    this.state = { concept: {} };
    this.getConcept = this.getConcept.bind(this);
  }

  componentDidMount() {
    this.getConcept();
  }

  async getConcept() {
    const { node, locale } = this.props;
    const concept = await fetchConcept(node.data.get('content-id'), locale);
    this.setState({ concept, linkText: node.data.get('link-text') });
  }

  render() {
    const { t } = this.props;
    const { concept, linkText } = this.state;
    return concept.id ? (
      <Concept
        id={concept.id}
        title={concept.title ? concept.title.title : ''}
        authors={[]}
        content={concept.content ? concept.content.content : ''}
        messages={{
          ariaLabel: t('concept.showDescription'),
          close: t('close'),
        }}
        source={''}
        license={''}>
        {linkText}
      </Concept>
    ) : null;
  }
}

SlateConcept.propTypes = {
  t: PropTypes.func,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(SlateConcept));
