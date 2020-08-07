/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldProps } from 'formik';
import { SubjectpageEditType, TranslateType } from '../../../interfaces';
import FormikField from '../../../components/FormikField';
import FormikVisualElement from '../../FormikForm/components/FormikVisualElement';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';

interface Props {
  t: TranslateType;
  values: SubjectpageEditType;
}

const SubjectpageAbout: FC<Props> = ({ t, values }) => {
  return (
    <>
      <FormikField
        name="title"
        noBorder
        title
        placeholder={t('form.name.title')}
      />
      <FormikField
        noBorder
        label={t('subjectpageForm.description')}
        name="description"
        showMaxLength
        maxLength={300}>
        {({ field }: FieldProps) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            placeholder={t('subjectpageForm.description')}
          />
        )}
      </FormikField>
      <FormikVisualElement />
    </>
  );
};

export default injectT(SubjectpageAbout);
