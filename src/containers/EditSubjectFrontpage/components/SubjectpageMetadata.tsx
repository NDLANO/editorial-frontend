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
import { TranslateType, FormikProps } from '../../../interfaces';
import SubjectpageBanner from './SubjectpageBanner';

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
        {({ field }: FormikProps) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t('form.metaDescription.label')}
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="desktopBanner">
        {({ field, form }: FormikProps) => {
          return (
            <SubjectpageBanner
              bannerId={field.value}
              field={field}
              form={form}
              title={t('form.name.desktopBanner')}
            />
          );
        }}
      </FormikField>
    </>
  );
};

export default injectT(SubjectpageMetadata);
