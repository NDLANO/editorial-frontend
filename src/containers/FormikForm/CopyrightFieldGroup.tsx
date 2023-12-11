/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { ContributorsField } from '.';
import LicenseField from './components/LicenseField';
import OriginField from './components/OriginField';
import ProcessedField from './components/ProcessedField';
import FormikField from '../../components/FormikField';

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
      <ProcessedField />
    </>
  );
};

export default memo(CopyrightFieldGroup);
