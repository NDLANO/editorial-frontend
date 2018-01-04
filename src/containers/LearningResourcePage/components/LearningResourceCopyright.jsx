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
import {
  SelectObjectField,
  AsyncDropdownField,
} from '../../../components/Fields';
import { CommonFieldPropsShape } from '../../../shapes';
import Accordion from '../../../components/Accordion';
import Contributors from '../../../components/Contributors/Contributors';
import * as draftApi from '../../../modules/draft/draftApi';

class LearningResourceCopyright extends Component {
  static async searchAgreements(query) {
    const response = await draftApi.fetchAgreements(query);
    return response.results;
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenContent: true,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState(prevState => ({
      hiddenContent: !prevState.hiddenContent,
    }));
  }

  render() {
    const { t, commonFieldProps, licenses, agreement } = this.props;
    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.copyrightSection')}
        hidden={this.state.hiddenContent}
        fill>
        <Contributors
          name="creators"
          label={t('form.creators.label')}
          {...commonFieldProps}
        />
        <Contributors
          name="rightsholders"
          label={t('form.rightsholders.label')}
          {...commonFieldProps}
        />
        <Contributors
          name="processors"
          label={t('form.processors.label')}
          {...commonFieldProps}
        />
        <AsyncDropdownField
          valueField="id"
          name="agreementId"
          selectedItem={agreement}
          textField="title"
          placeholder={t('form.agreement.placeholder')}
          label={t('form.agreement.label')}
          apiAction={LearningResourceCopyright.searchAgreements}
          {...commonFieldProps}
          messages={{
            emptyFilter: t('form.agreement.emptyFilter'),
            emptyList: t('form.agreement.emptyList'),
          }}
        />
        <SelectObjectField
          name="license"
          label={t('form.license.label')}
          options={licenses}
          idKey="license"
          labelKey="description"
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

LearningResourceCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  agreement: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.number,
  }),
};

export default injectT(LearningResourceCopyright);
