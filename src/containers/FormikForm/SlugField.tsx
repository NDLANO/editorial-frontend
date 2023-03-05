/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldProps } from 'formik';
import { TextArea } from '@ndla/forms';
import FormikField from '../../components/FormikField';

interface Props {
  maxLength?: number;
  name?: string;
  handleSubmit: () => Promise<void>;
  type?: string;
}

const SlugField = ({ name = 'slug', handleSubmit }: Props) => {
  const { t } = useTranslation();
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);
  return (
    <>
      <FormikField name={name}>
        {({ field }: FieldProps) => (
          <TextArea {...field} white placeholder={t('form.slug.label')} />
        )}
      </FormikField>
    </>
  );
};

export default SlugField;
