/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { DescriptionEditor } from "./DescriptionEditor";
import { TextFormValues } from "./types";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import { RulesType } from "../../../components/formikValidationSchema";
import { LicenseField } from "../../FormikForm";

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

interface Props {
  language: string | undefined;
  step: ILearningStepV2DTO | undefined;
}

export const textStepRules: RulesType<TextFormValues> = {
  title: {
    required: true,
    maxLength: TITLE_MAX_LENGTH,
  },
  introduction: {
    required: true,
    maxLength: INTRODUCTION_MAX_LENGTH,
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
            <FormRemainingCharacters value={field.value ?? ""} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.textForm.introductionLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
            <FormRemainingCharacters value={field.value ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
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
            <DescriptionEditor value={field.value} onChange={helpers.setValue} language={language} />
          </FieldRoot>
        )}
      </FormField>
    </>
  );
};
