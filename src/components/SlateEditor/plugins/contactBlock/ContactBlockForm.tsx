/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import {
  CheckboxItem,
  Label,
  RadioButtonItem,
  RadioButtonGroup,
  FieldErrorMessage,
  InputV3,
  TextAreaV3,
} from "@ndla/forms";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { TYPE_CONTACT_BLOCK } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { CheckboxWrapper, RadioButtonWrapper, FieldsetRow, StyledFormControl, LeftLegend } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

interface Props {
  initialData?: ContactBlockEmbedData;
  onSave: (data: ContactBlockEmbedData) => void;
  onCancel: () => void;
}

const StyledTextArea = styled(TextAreaV3)`
  min-height: ${spacing.xlarge};
`;

const toInitialValues = (initialData?: ContactBlockEmbedData): ContactBlockFormValues => {
  return {
    resource: TYPE_CONTACT_BLOCK,
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

const ContactBlockForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: ContactBlockFormValues) => {
      if (!values.metaImageId) {
        return;
      }
      const newData: ContactBlockEmbedData = {
        resource: TYPE_CONTACT_BLOCK,
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
      {({ dirty, isValid, values }) => (
        <Form>
          <FormField name="name">
            {({ field, meta }) => (
              <FormControl isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.name")}
                </Label>
                <InputV3 {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="jobTitle">
            {({ field, meta }) => (
              <FormControl isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.jobTitle")}
                </Label>
                <InputV3 {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="email">
            {({ field, meta }) => (
              <FormControl isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.email")}
                </Label>
                <InputV3 {...field} type="email" />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="description">
            {({ field, meta }) => (
              <FormControl isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.description")}
                </Label>
                <StyledTextArea {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="background">
            {({ field, helpers }) => (
              <StyledFormControl>
                <RadioButtonGroup
                  onValueChange={helpers.setValue}
                  orientation="horizontal"
                  defaultValue={field.value}
                  asChild
                >
                  <FieldsetRow>
                    <LeftLegend margin="none" textStyle="label-small">
                      {t("form.name.background")}
                    </LeftLegend>
                    {backgrounds.map((value) => (
                      <RadioButtonWrapper key={value.value}>
                        <RadioButtonItem id={`background-${value.value}`} value={value.value} />
                        <Label htmlFor={`background-${value.value}`} margin="none" textStyle="label-small">
                          {value.title}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </FieldsetRow>
                </RadioButtonGroup>
              </StyledFormControl>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {!values.isDecorative && !!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <Label margin="none" textStyle="label-small">
                    {t("form.name.metaImageAlt")}
                  </Label>
                  <InputV3 {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          )}
          {!!values.metaImageId && (
            <FormField name="isDecorative">
              {({ field, meta, helpers }) => (
                <FormControl isInvalid={!!meta.error}>
                  <CheckboxWrapper>
                    <Label margin="none" textStyle="label-small">
                      {t("form.image.isDecorative")}
                    </Label>
                    <CheckboxItem checked={field.value} onCheckedChange={helpers.setValue} />
                  </CheckboxWrapper>
                </FormControl>
              )}
            </FormField>
          )}
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit">
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default ContactBlockForm;
