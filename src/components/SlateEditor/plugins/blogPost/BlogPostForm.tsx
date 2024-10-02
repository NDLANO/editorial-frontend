/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { BlogPostEmbedData } from "@ndla/types-embed";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface BlogPostFormValues {
  resource: "blog-post";
  metaImageId?: number;
  title: Descendant[];
  size?: "normal" | "large";
  author?: string;
  link: string;
  metaImageAlt?: string;
}

const rules: RulesType<BlogPostFormValues> = {
  title: {
    required: true,
  },
  metaImageId: {
    required: true,
  },
  size: {
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

const toInitialValues = (initialData?: BlogPostEmbedData): BlogPostFormValues => {
  return {
    resource: "blog-post",
    title: inlineContentToEditorValue(initialData?.title ?? "", true),
    metaImageId: initialData?.imageId ? parseInt(initialData.imageId) : undefined,
    size: initialData?.size ?? "normal",
    link: initialData?.url ?? "",
    author: initialData?.author ?? "",
    metaImageAlt: initialData?.alt ?? "",
  };
};

interface Props {
  initialData?: BlogPostEmbedData;
  onSave: (data: BlogPostEmbedData) => void;
  onCancel: () => void;
}

const sizeValues: string[] = ["normal", "large"];

const BlogPostForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: BlogPostFormValues) => {
      if (!values.metaImageId) {
        return;
      }

      const newData: BlogPostEmbedData = {
        resource: "blog-post",
        imageId: values.metaImageId.toString(),
        title: inlineContentToHTML(values.title),
        size: values.size,
        author: values.author ?? "",
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
                <Text textStyle="label.medium" fontWeight="bold">
                  {t("form.name.title")}
                  <RichTextIndicator />
                </Text>
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
          <FormField name="author">
            {({ field, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel>{t("form.name.author")}</FieldLabel>
                <FieldInput {...field} />
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
          <FormField name="size">
            {({ field, helpers }) => (
              <FieldRoot required>
                <RadioGroupRoot
                  value={field.value}
                  orientation="horizontal"
                  onValueChange={(details) => helpers.setValue(details.value)}
                >
                  <RadioGroupLabel>{t("form.name.size")}</RadioGroupLabel>
                  {sizeValues.map((value) => (
                    <RadioGroupItem value={value} key={value}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{t(`blogPostForm.sizes.${value}`)}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput />
                    </RadioGroupItem>
                  ))}
                </RadioGroupRoot>
              </FieldRoot>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {values.metaImageId && (
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

export default BlogPostForm;
