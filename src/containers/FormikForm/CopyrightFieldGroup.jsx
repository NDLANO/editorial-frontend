/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LicenseField from './components/LicenseField';
import { AgreementConnectionField, ContributorsField } from '.';
import FormikField from '../../components/FormikField';
import { LicensesArrayOf } from '../../shapes';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

const CopyrightFieldGroup = ({
  licenses,
  values,
  contributorTypesOverride,
  disableAgreements,
  enableLicenseNA,
}) => {
  const disabled = !!values.agreementId;
  return (
    <Fragment>
      <ContributorsField contributorTypes={contributorTypesOverride || contributorTypes} />
      {disableAgreements || <AgreementConnectionField values={values} width={3 / 4} />}
      <FormikField name="license">
        {({ field }) => (
          <LicenseField
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

CopyrightFieldGroup.propTypes = {
  licenses: LicensesArrayOf.isRequired,
  values: PropTypes.shape({
    agreementId: PropTypes.number,
  }),
  contributorTypesOverride: PropTypes.arrayOf(PropTypes.string),
  disableAgreements: PropTypes.bool,
  enableLicenseNA: PropTypes.bool,
};

export default CopyrightFieldGroup;
