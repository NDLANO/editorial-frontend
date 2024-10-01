/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldLabel, FieldRoot, FieldTextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CommentEmbedData } from "@ndla/types-embed";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

const StyledTextArea = styled(FieldTextArea, {
  base: {
    maxHeight: "surface.xsmall",
    overflowY: "auto",
  },
});

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
  text: string;
}

const toInitialValues = (data?: CommentEmbedData): CommentFormValues => {
  return {
    resource: "comment",
    text: data?.text ?? "",
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
      text: values.text,
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
      {({ isValid, dirty }) => (
        <FormikForm>
          <FormField name="text">
            {({ field, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel srOnly={labelVisuallyHidden}>{labelText}</FieldLabel>
                <StyledTextArea {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormActionsContainer>
            <Button onClick={() => onOpenChange(false)} variant="secondary">
              {t("form.abort")}
            </Button>
            <Button type="submit" data-testid="disclaimer-save" disabled={!isValid || !dirty}>
              {t("form.save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default CommentForm;
