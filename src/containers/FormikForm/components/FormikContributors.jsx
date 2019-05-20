import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Contributors from '../../../components/Contributors';
import FormikField from '../../../components/FormikField';

const FormikContributors = ({ t, contributorTypes }) => {
  return contributorTypes.map(contributorType => {
    const label = t(`form.${contributorType}.label`);
    return (
      <FormikField
        showError={false}
        key={`formik_contributor_${contributorType}`}
        name={contributorType}>
        {({ field, form }) => {
          const { errors, touched } = form;
          const error =
            touched[field.name] && errors[field.name] ? errors[field.name] : '';
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
  });
};

FormikContributors.propTypes = {
  contributorTypes: PropTypes.arrayOf(PropTypes.string),
};

export default injectT(FormikContributors);
