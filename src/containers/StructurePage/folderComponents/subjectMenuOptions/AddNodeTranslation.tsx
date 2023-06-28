/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { ButtonV2 } from '@ndla/button';
import { Select, Input } from '@ndla/forms';
import { Heading } from '@ndla/ui';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { Translation } from '@ndla/types-taxonomy';
import { LocaleType } from '../../../../interfaces';
import { Row } from '../../../../components';
import FormikField from '../../../../components/FormikField';
import validateFormik from '../../../../components/formikValidationSchema';

const StyledFormikField = styled(FormikField)`
  margin-top: 0px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  onAddTranslation: (translation: Translation) => void;
  availableLanguages: LocaleType[];
  defaultName: string;
}

interface FormValues {
  name: string;
  language: LocaleType;
}

const AddNodeTranslation = ({ onAddTranslation, availableLanguages, defaultName }: Props) => {
  const { t } = useTranslation();

  const rules = {
    name: { required: true },
    language: { required: true },
  };

  const handleAddTranslation = (formik: FormikProps<FormValues>) => {
    const { values, resetForm } = formik;
    const newObj = { name: values.name!, language: values.language! };
    onAddTranslation(newObj);
    const next = availableLanguages.find((l) => l !== values.language) ?? availableLanguages[0];
    resetForm({ values: { language: next, name: defaultName } });
  };

  if (availableLanguages.length === 0) {
    return null;
  }

  const onKeyDown = (event: KeyboardEvent, formik: FormikProps<FormValues>) => {
    if (event.key === 'Enter' && formik.isValid && !formik.isSubmitting) {
      event.preventDefault();
      handleAddTranslation(formik);
    }
  };

  return (
    <Formik
      initialValues={{ language: availableLanguages[0], name: defaultName }}
      validate={(values) => validateFormik(values, rules, t, 'taxonomy.changeName')}
      validateOnBlur={false}
      enableReinitialize
      onSubmit={(_) => {}}
    >
      {(formik) => {
        const { isValid } = formik;
        return (
          <StyledForm>
            <Heading element="h2" headingStyle="h3">
              {t('taxonomy.changeName.addNewTranslation')}
            </Heading>
            <Row>
              <StyledFormikField name="language" label={t('taxonomy.changeName.language')}>
                {({ field }: FieldProps) => {
                  return (
                    <Select {...field}>
                      {availableLanguages.map((lang) => (
                        <option value={lang} key={lang}>
                          {t(`language.${lang}`)}
                        </option>
                      ))}
                    </Select>
                  );
                }}
              </StyledFormikField>
              <StyledFormikField name="name" label={t('taxonomy.changeName.name')}>
                {({ field }) => (
                  <Row>
                    <Input
                      {...field}
                      onKeyDown={(e: KeyboardEvent) => onKeyDown(e, formik)}
                      placeholder={t('taxonomy.changeName.namePlaceholder')}
                      data-testid="addNodeNameTranslation"
                    />
                    <ButtonV2
                      data-testid="addNodeNameTranslationButton"
                      onClick={() => handleAddTranslation(formik)}
                      disabled={!isValid}
                    >
                      {t('taxonomy.changeName.add')}
                    </ButtonV2>
                  </Row>
                )}
              </StyledFormikField>
            </Row>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default AddNodeTranslation;
