/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField/FormikField';
import CopyrightFieldGroup from '../../FormikForm/CopyrightFieldGroup';

import { License } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';

interface Props {
  licenses: License[];
  disableAgreements: boolean;
  label: string;
}

const ConceptCopyright = ({ licenses, disableAgreements, label }: Props) => {
  const { values } = useFormikContext<ConceptFormValues>();

  return (
    <Fragment>
      <CopyrightFieldGroup
        licenses={licenses}
        disableAgreements={disableAgreements}
        values={values}
        enableLicenseNA={true}
      />
      <FormikField label={label} name="source" />
    </Fragment>
  );
};

export default ConceptCopyright;
