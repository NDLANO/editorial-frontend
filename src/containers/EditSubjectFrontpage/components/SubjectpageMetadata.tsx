/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FocusEvent } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldProps } from 'formik';
import { Editor } from 'slate';
import FormikField from '../../../components/FormikField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../../components/SlateEditor/plugins/textTransform';

import { FormikProperties, ImageEmbed } from '../../../interfaces';
import SubjectpageBanner from './SubjectpageBanner';

interface FormikProps {
  field: FieldProps<ImageEmbed>['field'];
  form: FormikProperties['form'];
}

interface Props {
  handleSubmit: () => void;
  onBlur: (event: FocusEvent<HTMLDivElement>, editor: Editor) => void;
}

const SubjectpageMetadata = ({ handleSubmit, onBlur, t }: Props & tType) => {
  const plugins = [textTransformPlugin];
  return (
    <>
      <FormikField
        name="metaDescription"
        maxLength={300}
        showMaxLength
        label={t('form.metaDescription.label')}
        description={t('form.metaDescription.description')}>
        {({ field }: FieldProps) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            placeholder={t('form.metaDescription.label')}
            handleSubmit={handleSubmit}
            plugins={plugins}
            onBlur={onBlur}
          />
        )}
      </FormikField>
      <FormikField name="desktopBanner">
        {({ field, form }: FormikProps) => (
          <SubjectpageBanner field={field} form={form} title={t('form.name.desktopBanner')} />
        )}
      </FormikField>
    </>
  );
};

export default injectT(SubjectpageMetadata);
