/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { SelectObjectField } from '../../components/Fields';
import { CommonFieldPropsShape } from '../../shapes';
import Contributors from '../../components/Contributors/Contributors';
import { AgreementConnection } from '.';

const FormCopyright = ({ t, commonFieldProps, licenses, model }) => {
  const disabled = !!model.agreementId;
  return (
    <Fragment>
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
      <AgreementConnection commonFieldProps={commonFieldProps} model={model} />
      <SelectObjectField
        name="license"
        label={t('form.license.label')}
        options={licenses}
        idKey="license"
        labelKey="description"
        disabled={disabled}
        {...commonFieldProps}
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
};

export default injectT(FormCopyright);
