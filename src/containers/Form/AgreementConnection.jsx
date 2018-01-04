/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { AsyncDropdownField } from '../../components/Fields';
import { SchemaShape } from '../../shapes';
import * as draftApi from '../../modules/draft/draftApi';

class AgreementConnection extends Component {
  static async searchAgreements(query) {
    const response = await draftApi.fetchAgreements(query);
    return response.results;
  }

  constructor(props) {
    super(props);
    this.fetchAgreement = this.fetchAgreement.bind(this);
    this.state = { agreement: undefined };
  }

  componentWillMount() {
    const { model } = this.props;
    this.fetchAgreement(model.agreementId);
  }

  componentWillReceiveProps(nextProps) {
    const { model } = nextProps;
    if (this.props.model.agreementId !== model.agreementId) {
      this.setState({ agreement: undefined });
    }
  }

  async fetchAgreement(id) {
    if (id) {
      const agreement = await draftApi.fetchAgreement(id);
      this.setState({ agreement });
    }
  }

  render() {
    const { t, commonFieldProps } = this.props;

    return (
      <AsyncDropdownField
        valueField="id"
        name="agreementId"
        selectedItem={this.state.agreement}
        textField="title"
        placeholder={t('form.agreement.placeholder')}
        label={t('form.agreement.label')}
        apiAction={AgreementConnection.searchAgreements}
        {...commonFieldProps}
        messages={{
          emptyFilter: t('form.agreement.emptyFilter'),
          emptyList: t('form.agreement.emptyList'),
        }}
      />
    );
  }
}

AgreementConnection.propTypes = {
  model: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
  commonFieldProps: PropTypes.shape({
    schema: SchemaShape,
    bindInput: PropTypes.func.isRequired,
    submitted: PropTypes.bool.isRequired,
  }),
};

export default injectT(AgreementConnection);
