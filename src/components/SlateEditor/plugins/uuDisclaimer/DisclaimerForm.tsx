/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikValues } from "formik";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, fonts, misc, spacing } from "@ndla/core";
import { Label } from "@ndla/forms";
import { ModalBody } from "@ndla/modal";
import { SafeLink } from "@ndla/safelink";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { plainTextToEditorValue, editorValueToPlainText } from "../../../../util/articleContentConverter";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import PlainTextEditor from "../../PlainTextEditor";

const DISCLAIMER_EXAMPLES_LINK =
  "https://docs.google.com/spreadsheets/d/1g8cCqgS4BvaChHX4R6VR5V5Q83fvYcMrgneBJMkLWYs/edit?usp=sharing";

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSave: (values: UuDisclaimerEmbedData) => void;
}

interface DisclaimerFormValues {
  resource: "uu-disclaimer";
  disclaimer: Descendant[];
}

const StyledFormField = styled(FormField)`
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

const StyledText = styled(Text)`
  ${fonts.size.text.label.small}
`;

const rules: RulesType<DisclaimerFormValues> = {};

const toInitialValues = (data?: UuDisclaimerEmbedData): DisclaimerFormValues => {
  return {
    resource: "uu-disclaimer",
    disclaimer: plainTextToEditorValue(data?.disclaimer ?? ""),
  };
};

const DisclaimerForm = ({ initialData, onOpenChange, onSave }: DisclaimerFormProps) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const handleSubmit = useCallback(
    (values: FormikValues) => {
      onSave({
        resource: "uu-disclaimer",
        disclaimer: editorValueToPlainText(values.disclaimer),
      });
      onOpenChange(false);
    },
    [onOpenChange, onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {() => (
        <Form>
          <StyledModalBody>
            <StyledText element="p" textStyle="label-small" margin="small">
              {t("form.disclaimer.exampleHeader")}
            </StyledText>
            <StyledText element="p" textStyle="meta-text-small" margin="none">
              {t("form.disclaimer.exampleText")}
            </StyledText>
            <StyledText element="p" textStyle="meta-text-small">
              <SafeLink to={DISCLAIMER_EXAMPLES_LINK}>{t("form.disclaimer.exampleLinkText")}</SafeLink>
            </StyledText>
            <StyledFormField name="disclaimer">
              {({ field }) => (
                <FormControl>
                  <Label textStyle="label-small">{t("form.disclaimer.editorHeader")}</Label>
                  <StyledPlainTextEditor
                    data-testid="disclaimer-editor"
                    id={field.name}
                    {...field}
                    value={initialValues.disclaimer}
                  />
                </FormControl>
              )}
            </StyledFormField>
            <DisclaimerActions>
              <ButtonV2 onClick={() => onOpenChange(false)} variant="outline">
                {t("form.abort")}
              </ButtonV2>
              <ButtonV2 type="submit" variant="solid" data-testid="disclaimer-save">
                {t("form.save")}
              </ButtonV2>
            </DisclaimerActions>
          </StyledModalBody>
        </Form>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
