/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons";
import {
  Button,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  FieldErrorMessage,
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxHiddenInput,
  DialogCloseTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface ContactBlockFormValues {
  resource: "contact-block";
  description: string;
  jobTitle: string;
  name: string;
  email: string;
  background: ContactBlockEmbedData["background"];
  metaImageId?: string;
  metaImageAlt: string;
  isDecorative: boolean;
}

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const rules: RulesType<ContactBlockFormValues> = {
  jobTitle: {
    required: true,
  },
  description: {
    required: true,
  },
  name: {
    required: true,
  },
  email: {
    required: true,
    email: true,
  },
  metaImageId: {
    required: true,
  },
  background: {
    required: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values) => !values.isDecorative && !!values.metaImageId,
  },
};

interface Props {
  initialData?: ContactBlockEmbedData;
  onSave: (data: ContactBlockEmbedData) => void;
}

const toInitialValues = (initialData?: ContactBlockEmbedData): ContactBlockFormValues => {
  return {
    resource: CONTACT_BLOCK_ELEMENT_TYPE,
    jobTitle: initialData?.jobTitle ?? "",
    background: initialData?.background ?? "subtle",
    description: initialData?.description ?? "",
    metaImageId: initialData?.imageId,
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    metaImageAlt: initialData?.alt ?? "",
    isDecorative: initialData?.alt === "",
  };
};
const colors: ContactBlockEmbedData["background"][] = ["subtle", "moderate", "strong"];

const ContactBlockForm = ({ initialData, onSave }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: ContactBlockFormValues) => {
      if (!values.metaImageId) {
        return;
      }
      const newData: ContactBlockEmbedData = {
        resource: CONTACT_BLOCK_ELEMENT_TYPE,
        imageId: values.metaImageId,
        jobTitle: values.jobTitle,
        description: values.description,
        name: values.name,
        background: values.background,
        email: values.email,
        alt: values.isDecorative ? "" : values.metaImageAlt,
      };
      onSave(newData);
    },
    [onSave],
  );

  const backgrounds = useMemo(
    () =>
      colors.map((value) => ({
        title: t(`contactBlockForm.background.${value}`),
        value: value!,
      })),
    [t],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid, values, setFieldValue, setFieldTouched }) => (
        <FormikForm>
          <FormField name="name">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.name.name")}</FieldLabel>
                <FieldInput {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="jobTitle">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.name.jobTitle")}</FieldLabel>
                <FieldInput {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="email">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.name.email")}</FieldLabel>
                <FieldInput {...field} type="email" />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="description">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.name.description")}</FieldLabel>
                <FieldTextArea {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="background">
            {({ field, helpers }) => (
              <RadioGroupRoot
                value={field.value}
                onValueChange={(details) => helpers.setValue(details.value)}
                orientation="horizontal"
              >
                <RadioGroupLabel textStyle="label.medium">{t("form.name.background")}</RadioGroupLabel>
                {backgrounds.map((value) => (
                  <RadioGroupItem key={value.value} value={value.value}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{value.title}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioGroupRoot>
            )}
          </FormField>
          <InlineImageSearch
            name="metaImageId"
            disableAltEditing
            hideAltText
            values={values}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
          {!values.isDecorative && !!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FieldRoot invalid={!!meta.error}>
                  <FieldLabel>{t("form.name.metaImageAlt")}</FieldLabel>
                  <FieldInput {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
          )}
          {!!values.metaImageId && (
            <FormField name="isDecorative">
              {({ field, meta, helpers }) => (
                <FieldRoot invalid={!!meta.error}>
                  <StyledCheckboxRoot
                    checked={field.value}
                    onCheckedChange={(details) => helpers.setValue(details.checked)}
                  >
                    <CheckboxLabel>{t("form.image.isDecorative")}</CheckboxLabel>
                    <CheckboxControl>
                      <CheckboxIndicator asChild>
                        <CheckLine />
                      </CheckboxIndicator>
                    </CheckboxControl>
                    <CheckboxHiddenInput />
                  </StyledCheckboxRoot>
                </FieldRoot>
              )}
            </FormField>
          )}
          <FormActionsContainer>
            <DialogCloseTrigger asChild>
              <Button variant="secondary">{t("cancel")}</Button>
            </DialogCloseTrigger>
            <Button disabled={!dirty || !isValid} type="submit">
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default ContactBlockForm;
