/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FormikField from '../../../components/FormikField/FormikField';
import CopyrightForm from '../../FormikForm/CopyrightForm';

const ConceptCopyright = ({
  licenses,
  contributorTypesOverride,
  disableAgreements,
  label,
  values,
}) => {
  return (
    <Fragment>
      <CopyrightForm
        licenses={licenses}
        contributorTypesOverride={contributorTypesOverride}
        disableAgreements={disableAgreements}
        values={values}
        enableLicenseNA={true}
      />
      <FormikField label={label} name="source" />
    </Fragment>
  );
};

ConceptCopyright.propTypes = {
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
  label: PropTypes.string,
};

export default ConceptCopyright;
