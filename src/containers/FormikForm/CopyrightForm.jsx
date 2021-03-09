/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LicenseForm from './components/LicenseForm';
import { AgreementConnectionForm, ContributorsForm } from '.';
import FormikField from '../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const CopyrightForm = ({
  licenses,
  values,
  contributorTypesOverride,
  disableAgreements,
  enableLicenseNA,
}) => {
  const disabled = !!values.agreementId;
  return (
    <Fragment>
      <ContributorsForm contributorTypes={contributorTypesOverride || contributorTypes} />
      {disableAgreements || <AgreementConnectionForm values={values} width={3 / 4} />}
      <FormikField name="license">
        {({ field }) => (
          <LicenseForm
            disabled={disabled}
            licenses={licenses}
            enableLicenseNA={enableLicenseNA}
            {...field}
          />
        )}
      </FormikField>
    </Fragment>
  );
};

CopyrightForm.propTypes = {
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
  enableLicenseNA: PropTypes.bool,
};

export default CopyrightForm;
