/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { PitchEmbedData } from "@ndla/types-embed";
import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface PitchFormValues {
  resource: "pitch";
  metaImageId?: string;
  title: Descendant[];
  description?: Descendant[];
  link: string;
  metaImageAlt?: string;
}

const rules: RulesType<PitchFormValues> = {
  title: {
    required: true,
  },
  metaImageId: {
    required: true,
  },
  description: {
    required: true,
  },
  link: {
    required: true,
    url: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (value) => !!value.metaImageId,
  },
};

const toInitialValues = (initialData?: PitchEmbedData): PitchFormValues => {
  return {
    resource: "pitch",
    title: inlineContentToEditorValue(initialData?.title ?? "", true),
    metaImageId: initialData?.imageId,
    description: inlineContentToEditorValue(initialData?.description ?? "", true),
    link: initialData?.url ?? "",
    metaImageAlt: initialData?.alt ?? "",
  };
};

interface Props {
  initialData?: PitchEmbedData;
  onSave: (data: PitchEmbedData) => void;
  onCancel: () => void;
}

const PitchForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: PitchFormValues) => {
      if (!values.metaImageId) {
        return;
      }

      const newData: PitchEmbedData = {
        resource: "pitch",
        imageId: values.metaImageId,
        title: inlineContentToHTML(values.title),
        description: inlineContentToHTML(values.description ?? []),
        url: values.link,
        alt: values.metaImageAlt ?? "",
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
          <FormField name="description">
            {({ field, meta, helpers }) => (
              <FieldRoot required invalid={!!meta.error}>
                <ContentEditableFieldLabel>
                  {t("form.name.description")}
                  <RichTextIndicator />
                </ContentEditableFieldLabel>
                <InlineField
                  {...field}
                  placeholder={t("form.name.description")}
                  submitted={isSubmitting}
                  onChange={helpers.setValue}
                />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="link">
            {({ field, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel>{t("form.name.link")}</FieldLabel>
                <FieldInput {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {!!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FieldRoot required invalid={!!meta.error}>
                  <FieldLabel>{t("form.name.metaImageAlt")}</FieldLabel>
                  <FieldInput {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
          )}
          <FormActionsContainer>
            <Button variant="secondary" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button disabled={!dirty || !isValid} type="submit">
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default PitchForm;
