/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FormikLicense from './components/FormikLicense';
import { FormikAgreementConnection, FormikContributors } from '.';
import FormikField from '../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const FormikCopyright = ({
  licenses,
  values,
  contributorTypesOverride,
  disableAgreements,
}) => {
  const disabled = !!values.agreementId;
  return (
    <Fragment>
      <FormikContributors
        contributorTypes={contributorTypesOverride || contributorTypes}
      />
      {disableAgreements || (
        <FormikAgreementConnection values={values} width={3 / 4} />
      )}
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
  contributorTypesOverride: PropTypes.arrayOf(PropTypes.string),
  disableAgreements: PropTypes.bool,
};

export default FormikCopyright;
