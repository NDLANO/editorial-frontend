/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { FieldErrorMessage, FieldHelper, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ExternalFormValues } from "./types";
import { FormField } from "../../../components/FormField";
import { RulesType } from "../../../components/formikValidationSchema";
import { isUrl } from "../../../components/validators";
import { fetchOpenGraphData } from "../../../modules/opengraph/openGraphApi";
import { LicenseField } from "../../FormikForm";
import { LearningpathTextEditor } from "../components/LearningpathTextEditor";
import { getFormTypeFromStep } from "../learningpathUtils";

interface Props {
  step: LearningStepV2DTO | undefined;
  language: string | undefined;
}

export const externalStepRules: RulesType<ExternalFormValues> = {
  title: {
    required: true,
  },
  introduction: {
    required: true,
  },
  url: {
    required: true,
    url: true,
  },
};

export const ExternalStepForm = ({ step, language }: Props) => {
  const { t } = useTranslation();
  const { values, initialValues, setFieldValue } = useFormikContext<ExternalFormValues>();

  useEffect(() => {
    if (
      values.url.length &&
      values.url !== initialValues.url &&
      (!values.title || !values.introduction) &&
      isUrl(values.url)
    ) {
      fetchOpenGraphData(values.url).then((data) => {
        if (!values.title) {
          setFieldValue("title", data.title);
        }
        if (!values.introduction) {
          setFieldValue("introduction", data.description);
        }
      });
    }
  }, [values.url, values.title, values.introduction, setFieldValue, initialValues.url]);

  return (
    <>
      <FormField name="url">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.externalForm.urlLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="title">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.externalForm.titleLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.externalForm.introductionLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      <LicenseField />
      {!!step?.description?.description.length && getFormTypeFromStep(step) === "external" && (
        <FormField name="description">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <ContentEditableFieldLabel>
                {t("learningpathForm.steps.externalForm.descriptionLabel")}
              </ContentEditableFieldLabel>
              <FieldHelper>{t("learningpathForm.steps.externalForm.descriptionHelper")}</FieldHelper>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <LearningpathTextEditor value={field.value} onChange={helpers.setValue} language={language} />
            </FieldRoot>
          )}
        </FormField>
      )}
    </>
  );
};
