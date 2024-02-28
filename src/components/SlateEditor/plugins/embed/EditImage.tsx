/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikProps } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, stackOrder } from "@ndla/core";
import { CheckboxItem, FieldErrorMessage, Label, TextAreaV3 } from "@ndla/forms";
import { Text } from "@ndla/typography";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import ImageEditor from "../../../../containers/ImageEditor/ImageEditor";
import { ImageEmbed } from "../../../../interfaces";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import parseMarkdown from "../../../../util/parseMarkdown";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { useInGrid } from "../grid/GridContext";

interface Props {
  embed: ImageEmbed;
  saveEmbedUpdates: (values: { [x: string]: string | undefined }) => void;
  setEditModus: Function;
  language: string;
  allowDecorative?: boolean;
}

export interface ImageEditFormValues {
  alt: string;
  resourceId: string;
  caption: Descendant[];
  isDecorative: boolean;
  border: boolean;
  focalX?: string;
  focalY?: string;
  upperLeftX?: string;
  upperLeftY?: string;
  lowerRightX?: string;
  lowerRightY?: string;
  align?: string;
  size?: string;
  hideByline: boolean;
}

const toImageEmbedFormValues = (embed: ImageEmbed): ImageEditFormValues => {
  return {
    resourceId: embed.resource_id,
    alt: embed.alt,
    caption: inlineContentToEditorValue(parseMarkdown({ markdown: embed.caption ?? "", inline: true }), true),
    isDecorative: embed["is-decorative"] === "true",
    border: embed.border === "true",
    focalX: embed["focal-x"],
    focalY: embed["focal-y"],
    upperLeftX: embed["upper-left-x"],
    upperLeftY: embed["upper-left-y"],
    lowerRightX: embed["lower-right-x"],
    lowerRightY: embed["lower-right-y"],
    align: embed.align,
    size: embed.size?.replace("-hide-byline", ""),
    hideByline: !!embed.size?.includes("hide-byline"),
  };
};

const formRules: RulesType<ImageEditFormValues> = {
  alt: {
    test: (values) => {
      if (!values.alt && !values.isDecorative) {
        return { translationKey: "form.image.alt.noText" };
      }
    },
  },
};

const EditImage = ({ embed, saveEmbedUpdates, setEditModus, language, allowDecorative }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toImageEmbedFormValues(embed), [embed]);

  const handleSave = (values: ImageEditFormValues) => {
    const size = values.align === "center" ? "full" : values.size;
    saveEmbedUpdates({
      resource: "image",
      resource_id: embed.resource_id,
      alt: values.alt,
      caption: inlineContentToHTML(values.caption),
      "is-decorative": values.isDecorative ? "true" : "false",
      border: values.border ? "true" : "false",
      "focal-x": values.focalX,
      "focal-y": values.focalY,
      "upper-left-x": values.upperLeftX,
      "upper-left-y": values.upperLeftY,
      "lower-right-x": values.lowerRightX,
      "lower-right-y": values.lowerRightY,
      align: values.align,
      size: values.hideByline ? `${size}-hide-byline` : size,
    });
    setEditModus(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, formRules, t)}
      validateOnBlur={false}
      validateOnMount
    >
      {(formik) => (
        <EditImageForm
          {...formik}
          language={language}
          close={() => setEditModus(false)}
          allowDecorative={allowDecorative}
        />
      )}
    </Formik>
  );
};

interface EditImageFormProps extends FormikProps<ImageEditFormValues> {
  close: () => void;
  allowDecorative?: boolean;
  language: string;
}

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: ${stackOrder.offsetSingle};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const EditImageForm = ({
  isValid,
  values,
  language,
  setFieldValue,
  isSubmitting,
  dirty,
  allowDecorative,
  close,
}: EditImageFormProps) => {
  const { t } = useTranslation();
  const inGrid = useInGrid();
  return (
    <Form>
      <ImageEditor language={language} />
      <StyledInputWrapper>
        <div>
          <Text textStyle="label-small" margin="none">
            {t("form.image.caption.label")}
          </Text>
          <FormField name="caption">
            {({ field, helpers }) => (
              <InlineField
                {...field}
                placeholder={t("form.image.caption.placeholder")}
                submitted={isSubmitting}
                onChange={helpers.setValue}
              />
            )}
          </FormField>
        </div>
        {!values.isDecorative && (
          <FormField name="alt">
            {({ field, meta }) => (
              <FormControl isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.image.alt.label")}
                </Label>
                <TextAreaV3 {...field} placeholder={t("form.image.alt.placeholder")} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
        )}
        {allowDecorative && (
          <FormField name="isDecorative">
            {({ field, helpers }) => (
              <FormControl>
                <CheckboxWrapper>
                  <CheckboxItem
                    checked={field.value}
                    onCheckedChange={(newValue) => {
                      helpers.setValue(newValue, false);
                      if (newValue) {
                        setFieldValue("alt", "", false);
                      }
                    }}
                  />
                  <Label margin="none" textStyle="label-small">
                    {t("form.image.isDecorative")}
                  </Label>
                </CheckboxWrapper>
              </FormControl>
            )}
          </FormField>
        )}
        {inGrid && (
          <FormField name="border">
            {({ field, helpers }) => (
              <FormControl>
                <CheckboxWrapper>
                  <CheckboxItem checked={field.value} onCheckedChange={() => helpers.setValue(!field.value, true)} />
                  <Label margin="none" textStyle="label-small">
                    {t("form.image.showBorder")}
                  </Label>
                </CheckboxWrapper>
              </FormControl>
            )}
          </FormField>
        )}
        <ButtonWrapper>
          <ButtonV2 onClick={close} variant="outline">
            {t("form.abort")}
          </ButtonV2>
          <ButtonV2 disabled={!dirty || !isValid} type="submit">
            {t("form.image.save")}
          </ButtonV2>
        </ButtonWrapper>
      </StyledInputWrapper>
    </Form>
  );
};

export default EditImage;
