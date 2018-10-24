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
import { FormHeader, FormSections, FormDropdown } from 'ndla-forms';
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
      <FormHeader title={t('form.license.label')} width={3 / 4} />
      <FormSections>
        <div>
          <FormDropdown value="" {...commonFieldProps.bindInput('license')}>
            {licenses.map(license => (
              <option value={license.license} key={license.license}>
                {license.description}
              </option>
            ))}
          </FormDropdown>
        </div>
      </FormSections>
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
