/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikProps } from "formik";
import { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Select, InputV3, Label, FieldErrorMessage } from "@ndla/forms";
import { Translation } from "@ndla/types-taxonomy";
import { Heading } from "@ndla/typography";
import { Row } from "../../../../components";
import { FormControl, FormField } from "../../../../components/FormField";
import validateFormik from "../../../../components/formikValidationSchema";
import { LocaleType } from "../../../../interfaces";

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

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, formik: FormikProps<FormValues>) => {
    if (event.key === "Enter" && formik.isValid && !formik.isSubmitting) {
      event.preventDefault();
      handleAddTranslation(formik);
    }
  };

  return (
    <Formik
      initialValues={{ language: availableLanguages[0], name: defaultName }}
      validate={(values) => validateFormik(values, rules, t, "taxonomy.changeName")}
      validateOnBlur={false}
      enableReinitialize
      onSubmit={(_) => {}}
    >
      {(formik) => {
        const { isValid } = formik;
        return (
          <StyledForm>
            <Heading element="h2" headingStyle="h3">
              {t("taxonomy.changeName.addNewTranslation")}
            </Heading>
            <Row>
              <FormField name="language">
                {({ field, meta }) => {
                  return (
                    <FormControl isRequired isInvalid={!!meta.error}>
                      <Label margin="none" textStyle="label-small">
                        {t("taxonomy.changeName.language")}
                      </Label>
                      <Select {...field}>
                        {availableLanguages.map((lang) => (
                          <option value={lang} key={lang}>
                            {t(`languages.${lang}`)}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              </FormField>
              <FormField name="name">
                {({ field, meta }) => (
                  <FormControl isRequired isInvalid={!!meta.error}>
                    <Label margin="none" textStyle="label-small">
                      {t("taxonomy.changeName.name")}
                    </Label>
                    <Row>
                      <InputV3
                        {...field}
                        type="text"
                        onKeyDown={(e) => onKeyDown(e, formik)}
                        placeholder={t("taxonomy.changeName.namePlaceholder")}
                        data-testid="addNodeNameTranslation"
                      />
                      <ButtonV2
                        data-testid="addNodeNameTranslationButton"
                        onClick={() => handleAddTranslation(formik)}
                        disabled={!isValid}
                      >
                        {t("taxonomy.changeName.add")}
                      </ButtonV2>
                    </Row>
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  </FormControl>
                )}
              </FormField>
            </Row>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default AddNodeTranslation;
