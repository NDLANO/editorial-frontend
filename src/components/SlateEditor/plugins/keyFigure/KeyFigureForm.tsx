/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  DialogCloseTrigger,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { KeyFigureEmbedData } from "@ndla/types-embed";
import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";
import { KEY_FIGURE_ELEMENT_TYPE } from "./types";

interface Props {
  onSave: (data: KeyFigureEmbedData) => void;
  initialData: KeyFigureEmbedData;
}

interface KeyFigureFormValue {
  resource: "key-figure";
  metaImageId: string | undefined;
  title: Descendant[];
  subtitle: Descendant[];
  metaImageAlt?: string;
  isDecorative?: boolean;
}

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const toInitialValues = (initialData: KeyFigureEmbedData): KeyFigureFormValue => ({
  resource: KEY_FIGURE_ELEMENT_TYPE,
  metaImageId: initialData?.imageId,
  title: inlineContentToEditorValue(initialData?.title ?? "", true),
  subtitle: inlineContentToEditorValue(initialData?.subtitle, true),
  metaImageAlt: initialData?.alt ?? "",
  isDecorative: initialData ? initialData.alt === undefined : false,
});

const rules: RulesType<KeyFigureFormValue> = {
  title: {
    required: true,
  },
  subtitle: {
    required: true,
  },
  metaImageId: {
    required: false,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (value) => !!value.metaImageId && !value.isDecorative,
  },
};

const KeyFigureForm = ({ onSave, initialData }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: KeyFigureFormValue) => {
      const newData: KeyFigureEmbedData = {
        resource: KEY_FIGURE_ELEMENT_TYPE,
        imageId: values.metaImageId,
        title: inlineContentToHTML(values.title),
        subtitle: inlineContentToHTML(values.subtitle),
        alt: values.isDecorative ? undefined : values.metaImageAlt,
      };
      onSave(newData);
    },
    [onSave],
  );
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid, values, isSubmitting }) => (
        <FormikForm>
          <FormField name="title">
            {({ field, helpers, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <ContentEditableFieldLabel>
                  {t("form.name.title")}
                  <RichTextIndicator />
                </ContentEditableFieldLabel>
                <InlineField
                  {...field}
                  placeholder={t("form.name.title")}
                  submitted={isSubmitting}
                  onChange={helpers.setValue}
                />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="subtitle">
            {({ field, helpers, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <ContentEditableFieldLabel>
                  {t("form.name.subtitle")}
                  <RichTextIndicator />
                </ContentEditableFieldLabel>
                <InlineField
                  {...field}
                  placeholder={t("form.name.subtitle")}
                  submitted={isSubmitting}
                  onChange={helpers.setValue}
                />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {!values.isDecorative && !!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FieldRoot invalid={!!meta.error}>
                  <FieldLabel>{t("form.name.metaImageAlt")}</FieldLabel>
                  <FieldInput {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
          )}
          {!!values.metaImageId && (
            <FormField name="isDecorative">
              {({ field, helpers, meta }) => (
                <FieldRoot invalid={!!meta.error}>
                  <StyledCheckboxRoot
                    checked={field.value}
                    onCheckedChange={(details) => helpers.setValue(details.checked)}
                  >
                    <CheckboxControl>
                      <CheckboxIndicator asChild>
                        <CheckLine />
                      </CheckboxIndicator>
                    </CheckboxControl>
                    <CheckboxLabel>{t("form.image.isDecorative")}</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </StyledCheckboxRoot>
                </FieldRoot>
              )}
            </FormField>
          )}
          <FormActionsContainer>
            <DialogCloseTrigger asChild>
              <Button variant="secondary">{t("cancel")}</Button>
            </DialogCloseTrigger>
            <Button disabled={!isFormikFormDirty({ values, initialValues, dirty }) || !isValid} type="submit">
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default KeyFigureForm;
