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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, Label, TextAreaV3 } from "@ndla/forms";
import { Button } from "@ndla/primitives";
import { CommentEmbedData } from "@ndla/types-embed";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

const CommentActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0 0;
`;

const StyledTextArea = styled(TextAreaV3)`
  max-height: 300px;
  overflow-y: scroll;
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
        <Form>
          <FormField name="text">
            {({ field, meta }) => (
              <FormControl isRequired isInvalid={!!meta.error}>
                <Label visuallyHidden={labelVisuallyHidden} textStyle="label-small" margin="none">
                  {labelText}
                </Label>
                <StyledTextArea {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <CommentActions>
            <Button onClick={() => onOpenChange(false)} variant="secondary">
              {t("form.abort")}
            </Button>
            <Button type="submit" data-testid="disclaimer-save" disabled={!isValid || !dirty}>
              {t("form.save")}
            </Button>
          </CommentActions>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
