import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import * as conceptApi from '../../../src/modules/concept/conceptApi';
import handleError from '../../util/handleError';
import { async } from 'q';
import FieldHeader from '@ndla/forms/lib/FieldHeader';
import { getTimeSinceLastZoomLevelChanged } from 'monaco-editor/esm/vs/base/browser/browser';
import { Input } from '@ndla/forms';
import { OneColumn } from '@ndla/ui';
import ConceptForm from './ConceptForm';
import { HelmetWithTracker } from '@ndla/tracker';
import { connect } from 'react-redux';
import {
  actions as licenseActions,
  getAllLicenses,
} from '../../modules/license/license';
import * as messageActions from '../Messages/messagesActions';

class ConceptPage extends PureComponent {
  componentDidMount() {
    const { fetchLicenses, licenses } = this.props;
    if (!licenses.length) {
      fetchLicenses();
    }
  }

  render() {
    const { t, licenses } = this.props;
    //const { concept } = this.state;
    //console.log(concept);
    //this.onAddConcept('tytyt', 'Beskrivelgggse av konsept ye', 'nb');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <OneColumn>
          <HelmetWithTracker title={t(`conceptform.title`)} />
          <ConceptForm licenses={licenses} />
        </OneColumn>
      </div>
    );
  }
}
ConceptPage.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchLicenses: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  userAccess: PropTypes.string,
};

const mapDispatchToProps = {
  fetchLicenses: licenseActions.fetchLicenses,
  createMessage: (message = {}) => messageActions.addMessage(message),
  applicationError: messageActions.applicationError,
};

const mapStateToProps = state => ({
  licenses: getAllLicenses(state),
});

export default injectT(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConceptPage),
);

/*state = {
    title: undefined,
    content: undefined,
  };

  titleChanged = event => {
    this.setState({ title: event.target.value });
  };

  contentChanged = event => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = event => {
    this.onAddConcept(this.state.title, this.state.content, 'nb');
    //this.setState({ title: undefined, content: undefined });
    console.log(this.state.title);
    event.preventDefault();
  };
  
  
  /*
        <form onSubmit={this.handleSubmit}>
          <label>
            Begrep:
            <input
              type="text"
              name="title"
              value={this.state.value}
              onChange={this.titleChanged}
            />
          </label>
          <label>
            Forklaring:
            <input
              type="text"
              name="content"
              value={this.state.value}
              onChange={this.contentChanged}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
*/
