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
import FormikLicense from './components/FormikLicense';
import Contributors from '../../components/Contributors';
import { FormikAgreementConnection } from '.';
import FormikField from '../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const FormikCopyright = ({ t, licenses, values }) => {
  const disabled = !!values.agreementId;
  return (
    <Fragment>
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <FormikField
            showError={false}
            key={`formik_contributor_${contributorType}`}
            name={contributorType}>
            {({ field, form }) => {
              const { errors, touched } = form;
              const error =
                touched[field.name] && errors[field.name]
                  ? errors[field.name]
                  : '';
              return (
                <Contributors
                  label={label}
                  labelRemove={t(`form.${contributorType}.labelRemove`)}
                  showError={!!errors[field.name]}
                  errorMessages={
                    touched[field.name] && errors[field.name] ? [error] : []
                  }
                  {...field}
                />
              );
            }}
          </FormikField>
        );
      })}

      <FormikAgreementConnection values={values} width={3 / 4} />
      <FormikField name="license">
        {({ field }) => (
          <FormikLicense disabled={disabled} licenses={licenses} {...field} />
        )}
      </FormikField>
    </Fragment>
  );
};

FormikCopyright.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  values: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
};

export default injectT(FormikCopyright);
