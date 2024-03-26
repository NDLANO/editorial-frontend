/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label, RadioButtonGroup, RadioButtonItem } from "@ndla/forms";
import { BlogPostEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import parseMarkdown from "../../../../util/parseMarkdown";
import { RadioButtonWrapper, FieldsetRow, StyledFormControl, LeftLegend } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
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
    title: inlineContentToEditorValue(parseMarkdown({ markdown: initialData?.title ?? "", inline: true }), true),
    metaImageId: initialData?.imageId ? parseInt(initialData.imageId) : undefined,
    size: initialData?.size ?? "normal",
    link: initialData?.url ?? "",
    author: initialData?.author ?? "",
    metaImageAlt: initialData?.alt ?? "",
  };
};

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

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
        <Form>
          <div>
            <Text textStyle="label-small" margin="none">
              {t("form.name.title")}
              <RichTextIndicator />
            </Text>
            <FormField name="title">
              {({ field, helpers, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <InlineField
                    {...field}
                    placeholder={t("form.name.title")}
                    submitted={isSubmitting}
                    onChange={helpers.setValue}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          </div>
          <FormField name="author">
            {({ field, meta }) => (
              <FormControl isRequired isInvalid={!!meta.error}>
                <Label textStyle="label-small" margin="none">
                  {t("form.name.author")}
                </Label>
                <InputV3 {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="link">
            {({ field, meta }) => (
              <FormControl isRequired isInvalid={!!meta.error}>
                <Label textStyle="label-small" margin="none">
                  {t("form.name.link")}
                </Label>
                <InputV3 {...field} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="size">
            {({ field, helpers }) => (
              <StyledFormControl isRequired>
                <RadioButtonGroup
                  onValueChange={helpers.setValue}
                  orientation="horizontal"
                  defaultValue={field.value}
                  asChild
                >
                  <FieldsetRow>
                    <LeftLegend margin="none" textStyle="label-small">
                      {t("form.name.size")}
                    </LeftLegend>
                    {sizeValues.map((value) => (
                      <RadioButtonWrapper key={value}>
                        <RadioButtonItem id={`size-${value}`} value={value} />
                        <Label htmlFor={`size-${value}`} margin="none" textStyle="label-small">
                          {t(`blogPostForm.sizes.${value}`)}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </FieldsetRow>
                </RadioButtonGroup>
              </StyledFormControl>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />

          {values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FormControl isRequired isInvalid={!!meta.error}>
                  <Label textStyle="label-small" margin="none">
                    {t("form.name.metaImageAlt")}
                  </Label>
                  <InputV3 {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          )}
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit">
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default BlogPostForm;
