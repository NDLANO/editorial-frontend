import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { connect } from 'react-redux';
import { OneColumn } from '@ndla/ui';
import ConceptForm from './ConceptForm';
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
