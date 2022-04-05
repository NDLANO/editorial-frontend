/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Input } from '@ndla/forms';
import { FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import FormikField from '../../../components/FormikField';
const VersionNameField = () => {
  const { t } = useTranslation();
  return (
    <FormikField name="name" showError label={t('taxonomyVersions.form.name.label')}>
      {({ field }: FieldProps) => (
        <Input
          placeholder={t('taxonomyVersions.form.name.placeholder')}
          container="div"
          type="text"
          {...field}
        />
      )}
    </FormikField>
  );
};
export default VersionNameField;
