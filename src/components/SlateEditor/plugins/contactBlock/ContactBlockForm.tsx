/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Field, FieldProps, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CheckboxItem, InputV2, TextAreaV2, Label, RadioButtonItem, RadioButtonGroup } from "@ndla/forms";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { TYPE_CONTACT_BLOCK } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { CheckboxWrapper, RadioButtonWrapper, FieldsetRow, StyledFormControl, LeftLegend } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import FormikField from "../../../FormikField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface ContactBlockFormValues {
  resource: "contact-block";
  description: string;
  jobTitle: string;
  name: string;
  email: string;
  blobColor: ContactBlockEmbedData["blobColor"];
  blob: ContactBlockEmbedData["blob"];
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
  blobColor: {
    required: true,
  },
  blob: {
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

const StyledInput = styled(InputV2)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledTextArea = styled(TextAreaV2)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 130px;
`;

const StyledFormikField = styled(FormikField)`
  margin: 0px;
  padding-bottom: ${spacing.small};
`;

const inputStyle = css`
  display: flex;
  flex-direction: column;

  & > label {
    white-space: nowrap;
  }
`;

const toInitialValues = (initialData?: ContactBlockEmbedData): ContactBlockFormValues => {
  return {
    resource: TYPE_CONTACT_BLOCK,
    jobTitle: initialData?.jobTitle ?? "",
    blobColor: initialData?.blobColor ?? "green",
    description: initialData?.description ?? "",
    blob: initialData?.blob ?? "pointy",
    metaImageId: initialData?.imageId,
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    metaImageAlt: initialData?.alt ?? "",
    isDecorative: initialData?.alt === "",
  };
};
const types: ContactBlockEmbedData["blob"][] = ["pointy", "round"];
const colors: ContactBlockEmbedData["blobColor"][] = ["green", "pink"];

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
        blob: values.blob,
        blobColor: values.blobColor,
        email: values.email,
        alt: values.isDecorative ? "" : values.metaImageAlt,
      };
      onSave(newData);
    },
    [onSave],
  );

  const blobTypes = useMemo(
    () =>
      types.map((value) => ({
        title: t(`contactBlockForm.blob.${value}`),
        value: value!,
      })),
    [t],
  );

  const blobColors = useMemo(
    () =>
      colors.map((value) => ({
        title: t(`contactBlockForm.blobColor.${value}`),
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
      {({ dirty, isValid, handleSubmit }) => (
        <>
          <StyledFormikField name="name" showError>
            {({ field }: FieldProps) => <InputV2 label={t("form.name.name")} {...field} />}
          </StyledFormikField>
          <StyledFormikField name="jobTitle" showError>
            {({ field }: FieldProps) => <StyledInput label={t("form.name.jobTitle")} {...field} />}
          </StyledFormikField>
          <StyledFormikField name="email" type="email" showError>
            {({ field }: FieldProps) => <StyledInput label={t("form.name.email")} {...field} />}
          </StyledFormikField>
          <StyledFormikField name="description" showError>
            {({ field }: FieldProps) => <StyledTextArea label={t("form.name.description")} {...field} />}
          </StyledFormikField>
          <FormField name="blob">
            {({ field }) => (
              <StyledFormControl>
                <RadioButtonGroup
                  onValueChange={(value: string) =>
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    })
                  }
                  orientation="horizontal"
                  defaultValue={field.value}
                  asChild
                >
                  <FieldsetRow>
                    <LeftLegend margin="none" textStyle="label-small">
                      {t("form.name.blob")}
                    </LeftLegend>
                    {blobTypes.map((value) => (
                      <RadioButtonWrapper key={value.value}>
                        <RadioButtonItem id={`blob-type-${value.value}`} value={value.value} />
                        <Label htmlFor={`blob-type-${value.value}`} margin="none" textStyle="label-small">
                          {value.title}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </FieldsetRow>
                </RadioButtonGroup>
              </StyledFormControl>
            )}
          </FormField>
          <FormField name="blobColor">
            {({ field }) => (
              <StyledFormControl>
                <RadioButtonGroup
                  onValueChange={(value: string) =>
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    })
                  }
                  orientation="horizontal"
                  defaultValue={field.value}
                  asChild
                >
                  <FieldsetRow>
                    <LeftLegend margin="none" textStyle="label-small">
                      {t("form.name.blobColor")}
                    </LeftLegend>
                    {blobColors.map((value) => (
                      <RadioButtonWrapper key={value.value}>
                        <RadioButtonItem id={`blob-color-${value.value}`} value={value.value} />
                        <Label htmlFor={`blob-color-${value.value}`} margin="none" textStyle="label-small">
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
          <StyledFormikField name="metaImageAlt">
            {({ field, form }: FieldProps) => (
              <>
                {!form.values.isDecorative && form.values.metaImageId && (
                  <InputV2 customCss={inputStyle} label={t("form.name.metaImageAlt")} {...field} />
                )}
              </>
            )}
          </StyledFormikField>
          <Field name="isDecorative">
            {({ field, form }: FieldProps) => (
              <>
                {!!form.values.metaImageId && (
                  <FormControl>
                    <CheckboxWrapper>
                      <CheckboxItem
                        checked={field.value}
                        onCheckedChange={() =>
                          field.onChange({
                            target: { name: field.name, value: !field.value },
                          })
                        }
                      />
                      <Label margin="none" textStyle="label-small">
                        {t("form.image.isDecorative")}
                      </Label>
                    </CheckboxWrapper>
                  </FormControl>
                )}
              </>
            )}
          </Field>
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit" onClick={() => handleSubmit()}>
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </>
      )}
    </Formik>
  );
};

export default ContactBlockForm;
