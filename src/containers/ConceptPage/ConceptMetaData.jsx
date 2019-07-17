import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import FormikField from '../../components/FormikField';
import { FormikLicense, FormikContributors } from '../FormikForm';
const contributorTypes = ['creators', 'rightsholders', 'processors'];

const ConceptMetaData = ({ t, licenses }) => (
  <Fragment>
    <FormikField name="license">
      {({ field }) => <FormikLicense licenses={licenses} {...field} />}
    </FormikField>
    <FormikField label={t('form.origin.label')} name="origin" />
    <FormikContributors contributorTypes={contributorTypes} />
  </Fragment>
);

ConceptMetaData.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(ConceptMetaData);
