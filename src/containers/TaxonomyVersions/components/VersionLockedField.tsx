/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RadioButtonGroup } from '@ndla/ui';
import { FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';

const VersionLockedField = () => {
  const { t } = useTranslation();

  const options = [
    {
      title: t('taxonomyVersions.form.locked.locked'),
      value: 'true',
    },
    {
      title: t('taxonomyVersions.form.locked.unlocked'),
      value: 'false',
    },
  ];
  return (
    <FormikField name="locked" label={t('taxonomyVersions.form.locked.title')}>
      {({ field }: FieldProps) => (
        <RadioButtonGroup
          label={t('taxonomyVersions.form.locked.subTitle')}
          selected={field.value.toString()}
          uniqeIds
          options={options}
          onChange={value =>
            field.onChange({
              target: {
                name: field.name,
                value: value === 'true',
              },
            })
          }
        />
      )}
    </FormikField>
  );
};
export default VersionLockedField;
