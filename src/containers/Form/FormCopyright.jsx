/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import FormLicense from './components/FormLicense';
import { CommonFieldPropsShape } from '../../shapes';
import Contributors from '../../components/Contributors';
import { AgreementConnection } from '.';

const FormCopyright = ({ t, commonFieldProps, licenses, model }) => {
  const disabled = !!model.agreementId;
  return (
    <Fragment>
      <Contributors
        name="creators"
        label={t('form.creators.label')}
        labelRemove={t('form.creators.labelRemove')}
        placeholder={t('form.creators.placeholder')}
        disabled={disabled}
        {...commonFieldProps}
      />
      <Contributors
        name="rightsholders"
        label={t('form.rightsholders.label')}
        labelRemove={t('form.rightsholders.labelRemove')}
        placeholder={t('form.rightsholders.placeholder')}
        disabled={disabled}
        {...commonFieldProps}
      />
      <Contributors
        name="processors"
        label={t('form.processors.label')}
        labelRemove={t('form.processors.labelRemove')}
        placeholder={t('form.processors.placeholder')}
        {...commonFieldProps}
      />
      <AgreementConnection
        commonFieldProps={commonFieldProps}
        model={model}
        width={3 / 4}
      />
      <FormLicense
        disabled={disabled}
        licenses={licenses}
        commonFieldProps={commonFieldProps}
      />
    </Fragment>
  );
};

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
  locale: PropTypes.string.isRequired,
};

export default injectT(FormCopyright);
