/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikValues } from "formik";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { Button, DialogBody } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { UuDisclaimerEmbedData } from "@ndla/types-embed";
import { DISCLAIMER_TEMPLATES_URL, DisclaimerField } from "./DisclaimerField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { SlatePlugin } from "../../interfaces";
import { breakPlugin } from "../break";
import { breakRenderer } from "../break/render";
import { markPlugin } from "../mark";
import { markRenderer } from "../mark/render";
import { noopPlugin } from "../noop";
import { noopRenderer } from "../noop/render";
import { paragraphPlugin } from "../paragraph";
import { paragraphRenderer } from "../paragraph/render";
import { pastePlugin } from "../paste";
import saveHotkeyPlugin from "../saveHotkey";
import { spanPlugin } from "../span";
import { spanRenderer } from "../span/render";
import { textTransformPlugin } from "../textTransform";
import { toolbarPlugin } from "../toolbar";
import { createToolbarDefaultValues } from "../toolbar/toolbarState";
import { unsupportedElementRenderer } from "../unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../unsupported/unsupportedPlugin";

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  block: { hidden: true },
  inline: {
    hidden: true,
  },
});

export const disclaimerPlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin.configure({ options: { options: toolbarOptions } }),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin.configure({
    options: {
      supportedMarks: { value: ["bold", "italic", "sup", "sub"], override: true },
    },
  }),
  noopPlugin,
  unsupportedPlugin,
  pastePlugin,
];

const renderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  unsupportedElementRenderer,
];

const plugins = disclaimerPlugins.concat(renderers);

interface DisclaimerFormProps {
  initialData?: UuDisclaimerEmbedData;
  onOpenChange: (open: boolean) => void;
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
    },
    [onSave],
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
            <DisclaimerField
              submitted={isSubmitting}
              title={t("form.disclaimer.editorHeader")}
              description={
                <Trans i18nKey={"form.disclaimer.description"}>
                  <SafeLink to={DISCLAIMER_TEMPLATES_URL} target="_blank" />
                </Trans>
              }
              plugins={plugins}
            />
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
