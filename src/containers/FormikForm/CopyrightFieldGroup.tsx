/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useField } from 'formik';
import LicenseField from './components/LicenseField';
import { ContributorsField } from '.';
import FormikField from '../../components/FormikField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  enableLicenseNA?: boolean;
}

const CopyrightFieldGroup = <T extends { agreementId?: number }>({ enableLicenseNA }: Props) => {
  const [agreementId] = useField<T>('agreementId');
  return (
    <>
      <ContributorsField contributorTypes={contributorTypes} />
      <FormikField name="license">
        {({ field }) => (
          <LicenseField
            disabled={!!agreementId.value}
            enableLicenseNA={enableLicenseNA}
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default memo(CopyrightFieldGroup);
