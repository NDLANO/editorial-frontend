/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField/FormikField';
import FormikCopyright from '../../FormikForm/FormikCopyright';
import { License } from '../../../interfaces';

interface Props {
  licenses: License[];
  contributorTypesOverride: string[];
  disableAgreements: boolean;
  label: string;
}

const ConceptCopyright = ({
  licenses,
  contributorTypesOverride,
  disableAgreements,
  label,
}: Props) => {
  const { values } = useFormikContext();

  return (
    <Fragment>
      <FormikCopyright
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

export default ConceptCopyright;
