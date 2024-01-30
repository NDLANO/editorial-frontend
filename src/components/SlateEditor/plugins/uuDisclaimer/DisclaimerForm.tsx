/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import SafeLink from "@ndla/safelink";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { plainTextToEditorValue } from "../../../../util/articleContentConverter";
import FormikField from "../../../FormikField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import PlainTextEditor from "../../PlainTextEditor";
import saveHotkeyPlugin from "../saveHotkey";
import { textTransformPlugin } from "../textTransform";

const DISCLAIMER_EXAMPLES_LINK =
  "https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing";

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
}

interface DisclaimerFormValues {
  resource: "uu-disclaimer";
  disclaimer: Descendant[];
}

const rules: RulesType<DisclaimerFormValues> = {};

const toInitialValues = (data?: UuDisclaimerEmbedData): DisclaimerFormValues => {
  return {
    resource: "uu-disclaimer",
    disclaimer: plainTextToEditorValue(data?.disclaimer ?? ""),
  };
};

const DisclaimerForm = ({ initialData }: DisclaimerFormProps) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={() => console.log("submitting")}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {() => (
        <>
          <Text element="p" textStyle="meta-text-medium" margin="small">
            <b>{t("form.disclaimer.exampleHeader")}</b>
          </Text>
          <Text element="p" textStyle="meta-text-small" margin="none">
            {t("form.disclaimer.exampleText")}
          </Text>
          <Text element="p" textStyle="meta-text-small">
            <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t("form.disclaimer.exampleLinkText")}</SafeLink>
          </Text>
          <Text element="p" textStyle="meta-text-medium" margin="small">
            <b>{t("form.disclaimer.editorHeader")}</b>
          </Text>
          <FormikField name="disclaimerEditor" showError>
            {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => {
              console.log(field);
              return (
                <PlainTextEditor
                  id={field.name}
                  {...field}
                  placeholder={t("form.title.label")}
                  submitted={isSubmitting}
                  value={initialValues.disclaimer}
                />
              );
            }}
          </FormikField>
        </>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
