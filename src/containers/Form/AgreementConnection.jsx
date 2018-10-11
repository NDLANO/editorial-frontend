/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from 'ndla-i18n';
import { AsyncDropdownField } from '../../components/Fields';
import { SchemaShape } from '../../shapes';
import * as draftApi from '../../modules/draft/draftApi';
import { toEditAgreement } from '../../util/routeHelpers';

class AgreementConnection extends PureComponent {
  static async searchAgreements(query) {
    const response = await draftApi.fetchAgreements(query);
    return response.results;
  }

  constructor(props) {
    super(props);
    this.fetchAgreement = this.fetchAgreement.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { agreement: undefined };
  }

  componentDidMount() {
    const { model } = this.props;
    this.fetchAgreement(model.agreementId);
  }

  static getDerivedStateFromProps({ model }, { agreement }) {
    if (!model.agreementId && agreement) {
      return { agreement: undefined };
    }
    return null;
  }

  async fetchAgreement(id) {
    if (id) {
      const agreement = await draftApi.fetchAgreement(id);
      this.setState({ agreement });
    }
  }

  async handleChange(agreement) {
    const { commonFieldProps } = this.props;
    const { onChange } = commonFieldProps.bindInput('agreementId');
    if (agreement && agreement.id) {
      const fetchedAgreement = await draftApi.fetchAgreement(agreement.id);
      this.setState({ agreement: fetchedAgreement });
      const onChangeFields = [
        { name: 'agreementId', value: fetchedAgreement.id },
        { name: 'license', value: fetchedAgreement.copyright.license.license },
        { name: 'creators', value: fetchedAgreement.copyright.creators },
        {
          name: 'rightsholders',
          value: fetchedAgreement.copyright.rightsholders,
        },
      ];
      onChangeFields.forEach(field =>
        onChange({ target: { name: field.name, value: field.value } }),
      );
    } else {
      onChange({ target: { name: 'agreementId', value: undefined } });
    }
  }

  render() {
    const { t, commonFieldProps } = this.props;
    const { agreement } = this.state;
    return [
      <AsyncDropdownField
        key="agreement-connection-dropdown"
        valueField="id"
        name="agreementId"
        selectedItem={agreement}
        textField="title"
        placeholder={t('form.agreement.placeholder')}
        label={t('form.agreement.label')}
        apiAction={AgreementConnection.searchAgreements}
        {...commonFieldProps}
        messages={{
          emptyFilter: t('form.agreement.emptyFilter'),
          emptyList: t('form.agreement.emptyList'),
        }}
        onChange={this.handleChange}
      />,
      agreement && agreement.id ? (
        <Link
          key="agreement-connection-link"
          target="_blank"
          to={toEditAgreement(agreement.id)}>
          {agreement.title}
        </Link>
      ) : (
        undefined
      ),
    ];
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
