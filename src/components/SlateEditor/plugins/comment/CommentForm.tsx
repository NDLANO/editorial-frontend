/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, misc, spacing } from "@ndla/core";
import { FieldErrorMessage, Label } from "@ndla/forms";
import { CommentEmbedData } from "@ndla/types-embed";
import { editorValueToPlainText, plainTextToEditorValue } from "../../../../util/articleContentConverter";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import PlainTextEditor from "../../PlainTextEditor";

const StyledPlainTextEditor = styled(PlainTextEditor)`
  border-radius: ${misc.borderRadius};
  min-height: ${spacing.xxlarge};
  outline: 1px solid transparent;
  border: 1px solid ${colors.brand.primary};
  padding: ${spacing.xsmall};
  &:active,
  &:focus-visible {
    outline-color: ${colors.brand.primary};
  }
`;

const CommentActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0 0;
`;

interface Props {
  initialData: CommentEmbedData | undefined;
  onSave: (data: CommentEmbedData) => void;
  onOpenChange: (open: boolean) => void;
  labelText: string;
  labelVisuallyHidden?: boolean;
  commentType: "block" | "inline";
}

interface CommentFormValues {
  resource: "comment";
  text: Descendant[];
}

const toInitialValues = (data?: CommentEmbedData): CommentFormValues => {
  return {
    resource: "comment",
    text: plainTextToEditorValue(data?.text ?? ""),
  };
};

const rules: RulesType<CommentFormValues> = {
  text: {
    required: true,
  },
};

const CommentForm = ({
  initialData,
  onSave,
  onOpenChange,
  labelText,
  labelVisuallyHidden = false,
  commentType,
}: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);
  const onSubmit = (values: CommentFormValues) => {
    onSave({
      resource: "comment",
      text: editorValueToPlainText(values.text),
      type: commentType,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ isValid }) => (
        <Form>
          <FormField name="text">
            {({ field, meta }) => {
              return (
                <>
                  <FormControl isRequired isInvalid={!!meta.error}>
                    <Label visuallyHidden={labelVisuallyHidden} textStyle="label-small" margin="none">
                      {labelText}
                    </Label>
                    <StyledPlainTextEditor id={field.name} {...field} value={initialValues.text} />
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  </FormControl>
                </>
              );
            }}
          </FormField>
          <CommentActions>
            <ButtonV2 onClick={() => onOpenChange(false)} variant="outline">
              {t("form.abort")}
            </ButtonV2>
            <ButtonV2 type="submit" variant="solid" data-testid="disclaimer-save" disabled={!isValid}>
              {t("form.save")}
            </ButtonV2>
          </CommentActions>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;