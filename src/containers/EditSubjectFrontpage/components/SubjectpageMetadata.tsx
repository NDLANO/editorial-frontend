/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { FieldProps } from 'formik';
import { injectT } from '@ndla/i18n';
import FormikField from '../../../components/FormikField';
import { TranslateType } from '../../../interfaces';
import { FormikMetaImageSearch } from '../../FormikForm';

interface Props {
  t: TranslateType;
}

const SubjectpageMetadata: FC<Props> = ({ t }) => {
  return (
    <>
      <FormikField
        name="metaDescription"
        maxLength={300}
        showMaxLength
        label={t('form.metaDescription.label')}
        description={t('form.metaDescription.description')}
      />
      <FormikField name="banner.desktopId">
        {({ field, form }: FieldProps) => {
          return (
            <FormikMetaImageSearch
              metaImageId={field.value}
              onChange={field.onChange}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton={false}
              banner={t('subjectpageForm.desktopBanner')}
            />
          );
        }}
      </FormikField>
      <FormikField name="banner.mobileId">
        {({ field, form }: FieldProps) => {
          return (
            <FormikMetaImageSearch
              metaImageId={field.value}
              onChange={field.onChange}
              setFieldTouched={form.setFieldTouched}
              showRemoveButton={false}
              banner={t('subjectpageForm.mobileBanner')}
            />
          );
        }}
      </FormikField>
    </>
  );
};

export default injectT(SubjectpageMetadata);
