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
import { colors, fonts, misc, spacing } from "@ndla/core";
import { Label } from "@ndla/forms";
import { CommentEmbedData } from "@ndla/types-embed";
import {
  plugins,
  toolbarAreaFilters,
  toolbarOptions,
} from "../../../../containers/ArticlePage/components/commentToolbarUtils";
import { slateContentStyles } from "../../../../containers/ArticlePage/components/styles";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import RichTextEditor from "../../RichTextEditor";

const StyledFormControl = styled(FormControl)`
  [data-comment] {
    ${slateContentStyles};
    padding: 0 ${spacing.xxsmall};
    font-family: ${fonts.sans};
  }
`;

const StyledRichTextEditor = styled(RichTextEditor)`
  border-radius: ${misc.borderRadius};
  min-height: ${spacing.xxlarge};
  outline: 1px solid transparent;
  border: 1px solid ${colors.brand.primary};
  outline: 1px solid transparent;
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
  onClose: () => void;
  labelText: string;
  labelVisuallyHidden?: boolean;
}

interface CommentFormValues {
  resource: "comment";
  text: Descendant[];
}

const toInitialValues = (data?: CommentEmbedData): CommentFormValues => {
  return {
    resource: "comment",
    text: inlineContentToEditorValue(data?.text ?? "", true),
  };
};

const rules: RulesType<CommentFormValues> = {
  text: {
    required: true,
  },
};

const CommentForm = ({ initialData, onSave, onClose, labelText, labelVisuallyHidden = false }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);
  const onSubmit = (values: CommentFormValues) => {
    onSave({ resource: "comment", text: inlineContentToHTML(values.text) });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validate={(values) => validateFormik(values, rules, t)}
    >
      {() => (
        <Form>
          <FormField name="text">
            {({ field: { name, value, onChange }, meta }) => {
              return (
                <>
                  <StyledFormControl isRequired>
                    <Label visuallyHidden={labelVisuallyHidden} textStyle="label-small" margin="none">
                      {labelText}
                    </Label>
                    <StyledRichTextEditor
                      value={value ?? []}
                      hideBlockPicker
                      submitted={false}
                      plugins={plugins}
                      onChange={(value) =>
                        onChange({
                          target: {
                            value,
                            name,
                          },
                        })
                      }
                      toolbarOptions={toolbarOptions}
                      toolbarAreaFilters={toolbarAreaFilters}
                      data-comment=""
                    />
                  </StyledFormControl>
                  <CommentActions>
                    <ButtonV2 onClick={onClose} variant="outline">
                      {t("form.abort")}
                    </ButtonV2>
                    <ButtonV2 type="submit" variant="solid" data-testid="disclaimer-save" disabled={!!meta.error}>
                      {t("form.save")}
                    </ButtonV2>
                  </CommentActions>
                </>
              );
            }}
          </FormField>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
