/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikValues } from "formik";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { Button, DialogBody, FieldErrorMessage, FieldHelper, FieldRoot } from "@ndla/primitives";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { DisclaimerField } from "./DisclaimerField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSave: (values: UuDisclaimerEmbedData) => void;
}

interface DisclaimerFormValues {
  resource: "uu-disclaimer";
  disclaimer: Descendant[];
}

const rules: RulesType<DisclaimerFormValues> = {
  disclaimer: {
    required: true,
  },
};

const toInitialValues = (data?: UuDisclaimerEmbedData): DisclaimerFormValues => {
  return {
    resource: "uu-disclaimer",
    disclaimer: inlineContentToEditorValue(data?.disclaimer ?? "", true),
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
        disclaimer: inlineContentToHTML(values.disclaimer),
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
      {({ isSubmitting }) => (
        <DialogBody>
          <FormikForm>
            <FormField name="disclaimer">
              {({ field, meta, helpers }) => (
                <FieldRoot invalid={!!meta.error}>
                  <ContentEditableFieldLabel>
                    {t("form.disclaimer.editorHeader")}
                    <RichTextIndicator />
                  </ContentEditableFieldLabel>
                  <FieldHelper textStyle="body.medium">{t("form.disclaimer.description")}</FieldHelper>
                  <DisclaimerField {...field} submitted={isSubmitting} onChange={helpers.setValue} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
            <FormActionsContainer>
              <Button onClick={() => onOpenChange(false)} variant="secondary">
                {t("form.abort")}
              </Button>
              <Button type="submit" data-testid="disclaimer-save">
                {t("form.save")}
              </Button>
            </FormActionsContainer>
          </FormikForm>
        </DialogBody>
      )}
    </Formik>
  );
};

export default DisclaimerForm;
