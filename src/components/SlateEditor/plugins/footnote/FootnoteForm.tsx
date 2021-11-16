/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Button from '@ndla/button';
import { Formik, Form, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import Field from '../../../Field';
import MultiSelectDropdown from '../../../Dropdown/MultiSelectDropdown';
import FormikField from '../../../FormikField';
import validateFormik from '../../../formikValidationSchema';
import { FootnoteElement } from '.';

const marginLeftStyle = css`
  margin-left: 0.2rem;
`;

const rules = {
  title: { required: true },
  year: { required: true, minLength: 4, maxLength: 4, numeric: true },
  authors: { minItems: 1 },
};

const getInitialValues = (footnote: FootnoteElement['data'] | undefined): FootnoteFormikValues => ({
  title: footnote?.title || '',
  year: footnote?.year || '',
  resource: footnote?.resource || 'footnote',
  authors: footnote?.authors?.map(author => ({ id: author })) || [],
  edition: footnote?.edition || '',
  publisher: footnote?.publisher || '',
  type: footnote?.type || '',
});

interface FootnoteFormikValues {
  title: string;
  year: string;
  resource: string;
  authors: { id: string }[];
  edition: string;
  publisher: string;
  type: string;
}

interface Props {
  footnote: FootnoteElement['data'];
  onClose: () => void;
  isEdit: boolean;
  onRemove: () => void;
  onSave: (data: FootnoteElement['data']) => void;
}

const FootnoteForm = ({ isEdit, footnote, onRemove, onClose, onSave }: Props) => {
  const { t } = useTranslation();

  const handleSave = async (
    values: FootnoteFormikValues,
    actions: FormikHelpers<FootnoteFormikValues>,
  ) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    await onSave({ ...values, authors: values.authors.map(auth => auth.id) });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(footnote)}
      onSubmit={handleSave}
      validate={values => validateFormik(values, rules, t, 'footnoteForm')}>
      {({ submitForm }) => (
        <Form>
          <FormikField name="title" label={t('form.content.footnote.title')} />
          <FormikField name="year" label={t('form.content.footnote.year')} />
          <FormikField name="authors" label={t('form.content.footnote.authors.label')} obligatory>
            {({ field }) => (
              <MultiSelectDropdown
                labelField={'id'}
                showCreateOption
                shouldCreate={(allValues, newValue) => !allValues.some(v => v.id === newValue.id)}
                {...field}
              />
            )}
          </FormikField>
          <FormikField name="edition" label={t('form.content.footnote.edition')} />

          <FormikField name="publisher" label={t('form.content.footnote.publisher')} />
          <Field right>
            {isEdit && (
              <Button onClick={onRemove}>{t('form.content.footnote.removeFootnote')}</Button>
            )}
            <Button css={marginLeftStyle} outline onClick={onClose}>
              {t('form.abort')}
            </Button>
            <Button
              css={marginLeftStyle}
              data-cy="save_footnote"
              type="button"
              onClick={submitForm}>
              {t('form.save')}
            </Button>
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default FootnoteForm;
