/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHeader, Select } from '@ndla/forms';
import { FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';
import { VersionType } from '../../../modules/taxonomy/versions/versionApiTypes';

interface Props {
  existingVersions: VersionType[];
}

interface Option {
  value?: string;
  name: string;
}

const VersionSourceField = ({ existingVersions }: Props) => {
  const { t } = useTranslation();

  const defaultOption: Option = { name: t('taxonomyVersions.form.source.defaultOption') };

  const options: Option[] = existingVersions.map(v => ({ name: v.name, value: v.id }));
  return (
    <>
      <FieldHeader
        title={t('taxonomyVersions.form.source.title')}
        subTitle={t('taxonomyVersions.form.source.subTitle')}
      />
      <FormikField name="sourceId">
        {({ field }: FieldProps) => (
          <Select {...field}>
            {[defaultOption].concat(options).map(option => (
              <option value={option.value} key={option.name}>
                {option.name}
              </option>
            ))}
          </Select>
        )}
      </FormikField>
    </>
  );
};
export default VersionSourceField;
