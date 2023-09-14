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
import { useTranslation } from 'react-i18next';
import { FieldHeader, InputV2 } from '@ndla/forms';

const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props {
  enableLicenseNA?: boolean;
  disableOrigin?: boolean;
}

const Origin = () => {
  const { t } = useTranslation();
  return (
    <>
      <FieldHeader title={t('form.origin.label')} width={3 / 4} />
      <FormikField name="origin">
        {({ field, form }) => {
          return (
            <InputV2
              customCss={{ width: '75%' }}
              label={t('form.origin.label')}
              labelHidden={true}
              {...field}
            ></InputV2>
          );
        }}
      </FormikField>
    </>
  );
};

const CopyrightFieldGroup = <T extends { agreementId?: number }>({
  enableLicenseNA,
  disableOrigin,
}: Props) => {
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
      {disableOrigin || <Origin />}
    </>
  );
};

export default memo(CopyrightFieldGroup);
