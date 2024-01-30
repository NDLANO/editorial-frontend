/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Formik } from "formik";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, misc, spacing } from "@ndla/core";
import { ModalBody } from "@ndla/modal";
import SafeLink from "@ndla/safelink";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { plainTextToEditorValue } from "../../../../util/articleContentConverter";
import FormikField from "../../../FormikField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import PlainTextEditor from "../../PlainTextEditor";

const DISCLAIMER_EXAMPLES_LINK =
  "https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing";

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

interface DisclaimerFormValues {
  resource: "uu-disclaimer";
  disclaimer: Descendant[];
}

const StyledFormikField = styled(FormikField)`
  margin: 0;
`;

const StyledPlainTextEditor = styled(PlainTextEditor)`
  border: 1px solid ${colors.brand.grey};
  border-radius: ${misc.borderRadius};
  min-height: ${spacing.xxlarge};
  outline: none;
  padding: ${spacing.small};
  transition-duration: outline-color 100ms ease;
  outline: 2px solid transparent;

  &:focus {
    outline-color: ${colors.brand.primary};
  }
`;

const StyledModalBody = styled(ModalBody)`
  padding: ${spacing.normal};
`;

const DisclaimerActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0 0;
`;

const rules: RulesType<DisclaimerFormValues> = {};

const toInitialValues = (data?: UuDisclaimerEmbedData): DisclaimerFormValues => {
  return {
    resource: "uu-disclaimer",
    disclaimer: plainTextToEditorValue(data?.disclaimer ?? ""),
  };
};

const DisclaimerForm = ({ initialData, onOpenChange }: DisclaimerFormProps) => {
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
        <StyledModalBody>
          <Text element="p" textStyle="meta-text-medium" margin="small">
            <b>{t("form.disclaimer.exampleHeader")}</b>
          </Text>
          <Text element="p" textStyle="meta-text-small" margin="none">
            {t("form.disclaimer.exampleText")}
          </Text>
          <Text element="p" textStyle="meta-text-small">
            <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t("form.disclaimer.exampleLinkText")}</SafeLink>
          </Text>
          <Text element="p" textStyle="meta-text-medium" margin="none">
            <b>{t("form.disclaimer.editorHeader")}</b>
          </Text>
          <StyledFormikField name="disclaimerEditor" showError>
            {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => (
              <StyledPlainTextEditor
                id={field.name}
                {...field}
                submitted={isSubmitting}
                tabIndex={0}
                value={initialValues.disclaimer}
              />
            )}
          </StyledFormikField>
          <DisclaimerActions>
            <ButtonV2 onClick={() => onOpenChange(false)} variant="outline">
              Avbryt
            </ButtonV2>
            <ButtonV2 onClick={() => console.log("cancel")} variant="solid">
              Lagre
            </ButtonV2>
          </DisclaimerActions>
        </StyledModalBody>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
