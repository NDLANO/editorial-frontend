/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import LicenseField from './components/LicenseField';
import { ContributorsField } from '.';
import FormikField from '../../components/FormikField';
import OriginField from './components/OriginField';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  enableLicenseNA?: boolean;
}

const CopyrightFieldGroup = ({ enableLicenseNA }: Props) => {
  return (
    <>
      <ContributorsField contributorTypes={contributorTypes} />
      <FormikField name="license">
        {({ field }) => <LicenseField enableLicenseNA={enableLicenseNA} {...field} />}
      </FormikField>
      <OriginField />
    </>
  );
};

export default memo(CopyrightFieldGroup);
