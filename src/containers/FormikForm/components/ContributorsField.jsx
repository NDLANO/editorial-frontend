import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Contributors from '../../../components/Contributors';
import FormikField from '../../../components/FormikField';

const ContributorsField = ({ t, contributorTypes, width }) => {
  return contributorTypes.map(contributorType => {
    const label = t(`form.${contributorType}.label`);
    return (
      <FormikField
        showError={false}
        key={`formik_contributor_${contributorType}`}
        name={contributorType}>
        {({ field, form }) => {
          const { errors } = form;
          const error = errors[field.name] || '';
          return (
            <Contributors
              label={label}
              labelRemove={t(`form.${contributorType}.labelRemove`)}
              showError={!!errors[field.name]}
              errorMessages={errors[field.name] ? [error] : []}
              width={width}
              {...field}
            />
          );
        }}
      </FormikField>
    );
  });
};

ContributorsField.propTypes = {
  contributorTypes: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.number,
};

export default injectT(ContributorsField);
