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
import { SelectObjectField } from '../../components/Fields';
import { CommonFieldPropsShape } from '../../shapes';
import Accordion from '../../components/Accordion';
import Contributors from '../../components/Contributors/Contributors';
import { AgreementConnection } from './';

class FormCopyright extends Component {
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
    const { t, commonFieldProps, licenses, model } = this.props;
    const disabled = !!model.agreementId;
    return (
      <Accordion
        handleToggle={this.toggleContent}
        header={t('form.copyrightSection')}
        hidden={this.state.hiddenContent}>
        <Contributors
          name="creators"
          label={t('form.creators.label')}
          disabled={disabled}
          {...commonFieldProps}
        />
        <Contributors
          name="rightsholders"
          label={t('form.rightsholders.label')}
          disabled={disabled}
          {...commonFieldProps}
        />
        <Contributors
          name="processors"
          label={t('form.processors.label')}
          {...commonFieldProps}
        />
        <AgreementConnection
          commonFieldProps={commonFieldProps}
          model={model}
        />
        <SelectObjectField
          name="license"
          label={t('form.license.label')}
          options={licenses}
          idKey="license"
          labelKey="description"
          disabled={disabled}
          {...commonFieldProps}
        />
      </Accordion>
    );
  }
}

FormCopyright.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  model: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
};

export default injectT(FormCopyright);
