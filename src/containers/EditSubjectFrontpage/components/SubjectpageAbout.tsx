/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { FieldProps } from 'formik';
import FormikField from '../../../components/FormikField';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';

const SubjectpageAbout = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormikField name="title" noBorder title placeholder={t('form.name.title')} />
      <FormikField
        noBorder
        label={t('subjectpageForm.description')}
        name="description"
        showMaxLength
        maxLength={300}>
        {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            submitted={isSubmitting}
            placeholder={t('subjectpageForm.description')}
          />
        )}
      </FormikField>
      <VisualElementField types={['image', 'video']} />
    </>
  );
};

export default SubjectpageAbout;
