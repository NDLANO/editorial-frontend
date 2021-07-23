/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldProps } from 'formik';
import { Editor } from 'slate';
import FormikField from '../../../components/FormikField';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';

interface Props {
  handleSubmit: () => void;
  onBlur: (event: Event, editor: Editor, next: Function) => void;
}

const SubjectpageAbout = ({ t, handleSubmit, onBlur }: Props & tType) => {
  return (
    <>
      <FormikField name="title" noBorder title placeholder={t('form.name.title')} />
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
            handleSubmit={handleSubmit}
            onBlur={onBlur}
          />
        )}
      </FormikField>
      <VisualElementField types={['image', 'video']} videoTypes={['Brightcove']} />
    </>
  );
};

export default injectT(SubjectpageAbout);
