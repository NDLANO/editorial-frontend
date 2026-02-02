/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";
import { RulesType } from "../../../components/formikValidationSchema";
import { LicenseField } from "../../FormikForm";
import { LearningpathTextEditor } from "../components/LearningpathTextEditor";
import { TextFormValues } from "./types";

interface Props {
  language: string | undefined;
  step: LearningStepV2DTO | undefined;
}

export const textStepRules: RulesType<TextFormValues> = {
  title: {
    required: true,
  },
  introduction: {
    required: true,
  },
  description: {
    required: true,
  },
};

export const TextStepForm = ({ language, step }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <FormField name="title">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.textForm.titleLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.textForm.introductionLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      </FormField>
      {!!step?.license?.license.length && <LicenseField />}
      <FormField name="description">
        {({ field, meta, helpers }) => (
          <FieldRoot required invalid={!!meta.error}>
            <ContentEditableFieldLabel>
              {t("learningpathForm.steps.textForm.descriptionLabel")}
            </ContentEditableFieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <LearningpathTextEditor value={field.value} onChange={helpers.setValue} language={language} />
          </FieldRoot>
        )}
      </FormField>
    </>
  );
};
