/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { TranslateType, FormikProperties } from '../../../interfaces';
import SubjectpageBanner from './SubjectpageBanner';
import SubjectpageLayoutPicker from './SubjectpageLayoutPicker';

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
        description={t('form.metaDescription.description')}>
        {({ field }: FormikProperties) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t('form.metaDescription.label')}
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="desktopBanner">
        {({ field, form }: FormikProperties) => {
          return (
            <SubjectpageBanner
              field={field}
              form={form}
              title={t('form.name.desktopBanner')}
            />
          );
        }}
      </FormikField>
      <FormikField name="layout">
        {({ field, form }: FormikProperties) => {
          return (
            <SubjectpageLayoutPicker
              value={field.value}
              setFieldValue={form.setFieldValue}
              title={t('form.layout.title')}
              label={t('form.layout.label')}
            />
          );
        }}
      </FormikField>
    </>
  );
};

export default injectT(SubjectpageMetadata);
