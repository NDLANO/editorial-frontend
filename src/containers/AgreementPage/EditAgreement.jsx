/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AgreementForm from './components/AgreementForm';
import * as api from '../../modules/draft/draftApi';
import * as messageActions from '../Messages/messagesActions';

class EditAgreement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreement: undefined,
    };
    this.fetchAgreement = this.fetchAgreement.bind(this);
  }

  componentDidMount() {
    const { agreementId } = this.props;
    this.fetchAgreement(agreementId);
  }

  componentDidUpdate({ agreementId: prevId }) {
    const { agreementId } = this.props;
    if (prevId !== agreementId) {
      this.fetchAgreement(agreementId);
    }
  }

  async fetchAgreement(agreementId) {
    const { applicationError } = this.props;
    try {
      const fetchedAgreement = await api.fetchAgreement(agreementId);
      this.setState({ agreement: fetchedAgreement });
    } catch (err) {
      applicationError(err);
    }
  }

  render() {
    const { upsertAgreement, ...rest } = this.props;
    const { agreement } = this.state;
    if (!agreement) {
      return null;
    }
    return (
      <AgreementForm
        agreement={agreement}
        onUpdate={upsertAgreement}
        {...rest}
      />
    );
  }
}

EditAgreement.propTypes = {
  agreementId: PropTypes.string.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  upsertAgreement: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};
const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(EditAgreement);
