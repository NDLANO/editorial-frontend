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
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { ExternalFormValues } from "./types";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import { fetchOpenGraphData } from "../../../modules/opengraph/openGraphApi";

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

export const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zæøåA-ZÆØÅ0-9()@:%_\\+.~#?&\\/=]*)$/;

export const ExternalStepForm = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<ExternalFormValues>();

  useEffect(() => {
    if (values.url.length && (!values.title || !values.introduction) && URL_REGEX.test(values.url)) {
      fetchOpenGraphData(values.url).then((data) => {
        if (!values.title) {
          setFieldValue("title", data.title);
        }
        if (!values.introduction) {
          setFieldValue("introduction", data.description);
        }
      });
    }
  }, [values.url, values.title, values.introduction, setFieldValue]);

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
            <FormRemainingCharacters value={field.value ?? ""} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      </FormField>
      <FormField name="introduction">
        {({ field, meta }) => (
          <FieldRoot required invalid={!!meta.error}>
            <FieldLabel>{t("learningpathForm.steps.externalForm.introductionLabel")}</FieldLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldInput {...field} />
            <FormRemainingCharacters value={field.value ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
          </FieldRoot>
        )}
      </FormField>
    </>
  );
};
