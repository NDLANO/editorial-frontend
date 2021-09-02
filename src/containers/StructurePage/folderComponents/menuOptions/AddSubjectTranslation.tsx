/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/core';
import { FieldProps, Form, Formik, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { Select, Input } from '@ndla/forms';
import { Row } from '../../../../components';
import FormikField from '../../../../components/FormikField';
import validateFormik from '../../../../components/formikValidationSchema';
import { LocaleType } from '../../../../interfaces';
import { SubjectNameTranslation } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { isFormikFormDirty } from '../../../../util/formHelper';

const formikFieldStyle = css`
  margin-top: 0px;
`;

interface AddSubjectTranslationProps {
  onAddTranslation: (translation: SubjectNameTranslation) => void;
  availableLanguages: LocaleType[];
}

interface FormValues {
  name: string;
  language: LocaleType;
}

const AddSubjectTranslation = ({
  onAddTranslation,
  availableLanguages,
}: AddSubjectTranslationProps) => {
  const { t } = useTranslation();

  const rules = {
    name: { required: true },
    language: { required: true },
  };

  const handleAddTranslation = (formik: FormikProps<FormValues>) => {
    const { values, resetForm } = formik;
    const newObj = { name: values.name!, language: values.language! };
    onAddTranslation(newObj);
    const next = availableLanguages.find(l => l !== values.language) ?? availableLanguages[0];
    resetForm({ values: { language: next, name: '' } });
  };

  if (availableLanguages.length === 0) {
    return null;
  }

  const onKeyDown = (event: KeyboardEvent, formik: FormikProps<FormValues>) => {
    if (event.key === 'Enter' && formik.isValid && !formik.isSubmitting) {
      handleAddTranslation(formik);
    }
  };

  return (
    <Formik
      initialValues={{ language: availableLanguages[0], name: '' }}
      validate={values => validateFormik(values, rules, t, 'taxonomy.changeName')}
      validateOnBlur={false}
      enableReinitialize={true}
      onSubmit={_ => {}}>
      {formik => {
        const { values, dirty, isValid, initialValues } = formik;
        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        return (
          <Form
            css={css`
              margin-top: 2em;
            `}>
            <h1>{t('taxonomy.changeName.addNewTranslation')}</h1>
            <Row>
              <FormikField
                name="language"
                label={t('taxonomy.changeName.language')}
                css={formikFieldStyle}>
                {({ field }: FieldProps) => {
                  return (
                    <Select {...field}>
                      {availableLanguages.map(lang => (
                        <option value={lang} key={lang}>
                          {t(`language.${lang}`)}
                        </option>
                      ))}
                    </Select>
                  );
                }}
              </FormikField>
              <FormikField name="name" label={t('taxonomy.changeName.name')} css={formikFieldStyle}>
                {({ field }) => (
                  <Row>
                    <Input
                      {...field}
                      onKeyDown={(e: KeyboardEvent) => onKeyDown(e, formik)}
                      placeholder={t('taxonomy.changeName.namePlaceholder')}
                      data-testid="addSubjectNameTranslation"
                    />
                    <Button
                      data-testid="addSubjectNameTranslationButton"
                      onClick={() => handleAddTranslation(formik)}
                      disabled={!isValid || !formIsDirty}>
                      {t('taxonomy.changeName.add')}
                    </Button>
                  </Row>
                )}
              </FormikField>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSubjectTranslation;
