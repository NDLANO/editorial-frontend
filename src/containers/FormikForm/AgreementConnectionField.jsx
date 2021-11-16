/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'formik';
import { FieldHeader, FieldSection } from '@ndla/forms';
import * as draftApi from '../../modules/draft/draftApi';
import { toEditAgreement } from '../../util/routeHelpers';
import AsyncDropdown from '../../components/Dropdown/asyncDropdown/AsyncDropdown';
import HowToHelper from '../../components/HowTo/HowToHelper';
import FormikField from '../../components/FormikField';

class AgreementConnectionField extends Component {
  static async searchAgreements(query) {
    return await draftApi.fetchAgreements(query);
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

  async fetchAgreement(id) {
    if (id) {
      const agreement = await draftApi.fetchAgreement(id);
      this.setState({ agreement });
      return agreement;
    }
  }

  async handleChange(agreement) {
    const onChange = () => {};
    if (agreement && agreement.id) {
      const fetchedAgreement = await this.fetchAgreement(agreement.id);
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
      <>
        <FieldHeader title={t('form.agreement.label')} width={width}>
          <HowToHelper pageId="userAgreements" tooltip={t('form.agreement.helpLabel')} />
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
                apiAction={AgreementConnectionField.searchAgreements}
                idField="id"
                positionAbsolute
                name="agreementId"
                selectedItem={agreement}
                labelField="title"
                placeholder={t('form.agreement.placeholder')}
              />
            )}
          </FormikField>
        </FieldSection>
        {agreement && agreement.id && (
          <Link key="agreement-connection-link" target="_blank" to={toEditAgreement(agreement.id)}>
            {agreement.title}
          </Link>
        )}
      </>
    );
  }
}

AgreementConnectionField.propTypes = {
  width: PropTypes.number,
  values: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
};

AgreementConnectionField.defaultProps = {
  width: 1,
};

export default connect(withTranslation()(AgreementConnectionField));
