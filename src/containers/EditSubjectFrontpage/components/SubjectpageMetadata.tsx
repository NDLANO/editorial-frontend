/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldProps } from 'formik';
import { Editor } from 'slate';
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import textTransformPlugin from '../../../components/SlateEditor/plugins/textTransform';

import { FormikProperties, VisualElement } from '../../../interfaces';
import SubjectpageBanner from './SubjectpageBanner';

interface FormikProps {
  field: FieldProps<VisualElement>['field'];
  form: FormikProperties['form'];
}

interface Props {
  handleSubmit: () => void;
  onBlur: (event: Event, editor: Editor, next: Function) => void;
}

const SubjectpageMetadata: FC<Props & tType> = ({ handleSubmit, onBlur, t }) => {
  const plugins = [textTransformPlugin()];
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
            handleSubmit={handleSubmit}
            onChange={field.onChange}
            onBlur={onBlur}
            plugins={plugins}
          />
        )}
      </FormikField>
      <FormikField name="desktopBanner">
        {({ field, form }: FormikProps) => {
          return (
            <SubjectpageBanner field={field} form={form} title={t('form.name.desktopBanner')} />
          );
        }}
      </FormikField>
    </>
  );
};

export default injectT(SubjectpageMetadata);
