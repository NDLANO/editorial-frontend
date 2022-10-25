/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import LicenseField from './components/LicenseField';
import { AgreementConnectionField, ContributorsField } from '.';
import FormikField from '../../components/FormikField';
import ResponsibleField from './components/ResponsibleField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  values: {
    agreementId?: number;
    [x: string]: any;
  };
  disableAgreements?: boolean;
  enableLicenseNA?: boolean;
  enableResponsible?: boolean;
}

const CopyrightFieldGroup = ({
  values,
  disableAgreements,
  enableLicenseNA,
  enableResponsible,
}: Props) => {
  const disabled = !!values.agreementId;
  return (
    <>
      <ContributorsField contributorTypes={contributorTypes} />
      {enableResponsible && <ResponsibleField />}
      {disableAgreements || <AgreementConnectionField values={values} width={3 / 4} />}
      <FormikField name="license">
        {({ field }) => (
          <LicenseField disabled={disabled} enableLicenseNA={enableLicenseNA} {...field} />
        )}
      </FormikField>
    </>
  );
};

export default CopyrightFieldGroup;
