/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, FieldErrorMessage, FieldLabel, FieldRoot, FieldTextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Form, Formik, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../components/FormField";
import { FormActionsContainer } from "../../../../components/FormikForm";
import validateFormik from "../../../../components/formikValidationSchema";
import { plainTextToEditorValue } from "../../../../util/articleContentConverter";
import { CopyrightFieldGroup } from "../../../FormikForm";
import Titlefield from "../../../FormikForm/TitleField";
import { ImageFormikType, imageRules } from "../../imageTransformers";
import ImageMetaData from "../ImageMetaData";
const ACCEPTED_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".svg"]);

const stripFileExtension = (name: string) => {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return name;

  const ext = name.slice(lastDot).toLowerCase();
  if (!ACCEPTED_EXTENSIONS.has(ext)) return name;

  return name.slice(0, lastDot);
};

export const toImageFormValues = (
  common: ImageFormikType | undefined,
  specific: ImageFormikType | undefined,
  file: File | undefined,
  language: string,
): ImageFormikType => {
  return {
    language: language,
    supportedLanguages: [language],
    title: specific?.title ?? (file ? plainTextToEditorValue(stripFileExtension(file.name)) : []),
    alttext: specific?.alttext ?? common?.alttext ?? "",
    caption: specific?.caption ?? common?.caption ?? "",
    imageFile: file,
    tags: specific?.tags ?? common?.tags ?? [],
    creators: specific?.creators ?? common?.creators ?? [],
    processors: specific?.processors ?? common?.processors ?? [],
    rightsholders: specific?.rightsholders ?? common?.rightsholders ?? [],
    processed: specific?.processed ?? common?.processed ?? false,
    origin: specific?.origin ?? common?.origin ?? "",
    license: specific?.license ?? common?.license,
    modelReleased: specific?.modelReleased ?? common?.modelReleased ?? "not-set",
    inactive: specific?.inactive ?? common?.inactive ?? false,
  };
};

interface CommonProps {
  handleSubmit: (values: ImageFormikType) => void;
}

interface SpecificProps {
  file: File;
  commonValues: ImageFormikType;
  initialValues: ImageFormikType | undefined;
  handleSubmit: (values: ImageFormikType) => void;
}

const FormFieldsContainer = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledForm = styled(
  Form,
  {
    base: {
      width: "100%",
    },
  },
  { baseComponent: true },
);

export const SpecificImageInfoForm = ({ initialValues, commonValues, file, handleSubmit }: SpecificProps) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={toImageFormValues(commonValues, initialValues, file, commonValues.language)}
      onSubmit={handleSubmit}
      validate={(values) => validateFormik(values, imageRules, t)}
      validateOnMount
    >
      <StyledForm>
        <FormFields type="specific" />
      </StyledForm>
    </Formik>
  );
};

export const CommonImageInfoForm = ({ handleSubmit }: CommonProps) => {
  const { i18n } = useTranslation();

  return (
    <Formik initialValues={toImageFormValues(undefined, undefined, undefined, i18n.language)} onSubmit={handleSubmit}>
      <FormFields type="common" />
    </Formik>
  );
};

interface FormFieldsProps {
  type: "common" | "specific";
}

const FormFields = ({ type }: FormFieldsProps) => {
  const { t, i18n } = useTranslation();
  const { handleSubmit, errors } = useFormikContext();
  return (
    <FormFieldsContainer>
      {type === "specific" && <Titlefield hideToolbar />}
      <FormField name="caption">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.image.caption.label")}</FieldLabel>
            <FieldTextArea placeholder={t("form.image.caption.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <FormField name="alttext">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.image.alt.label")}</FieldLabel>
            <FieldTextArea {...field} placeholder={t("form.image.alt.placeholder")} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <CopyrightFieldGroup />
      <ImageMetaData imageLanguage={i18n.language} />
      <FormActionsContainer>
        <Button type="submit" onClick={() => handleSubmit()} disabled={!!Object.keys(errors).length}>
          {type === "common" ? t("bulkUploadImagePage.saveCommon") : t("save")}
        </Button>
      </FormActionsContainer>
    </FormFieldsContainer>
  );
};
