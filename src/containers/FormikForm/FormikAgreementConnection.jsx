/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { connect } from 'formik';
import { FieldHeader, FieldSection } from '@ndla/forms';
import * as draftApi from '../../modules/draft/draftApi';
import { toEditAgreement } from '../../util/routeHelpers';
import { AsyncDropdown } from '../../components/Dropdown';
import HowToHelper from '../../components/HowTo/HowToHelper';
import FormikField from '../../components/FormikField';

class FormikAgreementConnection extends Component {
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
    const { values } = this.props;
    this.fetchAgreement(values.agreementId);
  }

  static getDerivedStateFromProps({ values }, { agreement }) {
    if (!values.agreementId && agreement) {
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
    const onChange = () => {};
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
    const { t, width } = this.props;
    const { agreement } = this.state;
    return (
      <Fragment>
        <FieldHeader title={t('form.agreement.label')} width={width}>
          <HowToHelper
            pageId="userAgreements"
            tooltip={t('form.agreement.helpLabel')}
          />
        </FieldHeader>
        <FieldSection>
          <FormikField name="agreementId">
            {({ field }) => (
              <AsyncDropdown
                {...field}
                onChange={val =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: val ? val.id : undefined,
                    },
                  })
                }
                apiAction={FormikAgreementConnection.searchAgreements}
                valueField="id"
                name="agreementId"
                selectedItem={agreement}
                textField="title"
                placeholder={t('form.agreement.placeholder')}
                messages={{
                  emptyFilter: t('form.agreement.emptyFilter'),
                  emptyList: t('form.agreement.emptyList'),
                }}
              />
            )}
          </FormikField>
        </FieldSection>
        {agreement && agreement.id && (
          <Link
            key="agreement-connection-link"
            target="_blank"
            to={toEditAgreement(agreement.id)}>
            {agreement.title}
          </Link>
        )}
      </Fragment>
    );
  }
}

FormikAgreementConnection.propTypes = {
  width: PropTypes.number,
  values: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
};

FormikAgreementConnection.defaultProps = {
  width: 1,
};

export default connect(injectT(FormikAgreementConnection));
