/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { TextArea } from '@ndla/forms';
import FormikField from '../../components/FormikField';

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
}

const SlugField = ({ name = 'slug' }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormikField name={name}>
        {({ field }: FieldProps) => <TextArea {...field} white placeholder={t('form.slug.label')} />}
      </FormikField>
    </>
  );
};

export default SlugField;
