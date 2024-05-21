/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, stackOrder } from "@ndla/core";
import { CheckboxItem, FieldErrorMessage, Label, TextAreaV3 } from "@ndla/forms";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import ImageEditor from "../../../../containers/ImageEditor/ImageEditor";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";
import { useInGrid } from "../grid/GridContext";

interface Props {
  embed: ImageEmbedData;
  image?: IImageMetaInformationV3;
  onSave: (data: ImageEmbedData) => void;
  onClose: () => void;
  language: string;
  allowDecorative: boolean;
}

export interface ImageEmbedFormValues {
  size?: string;
  align?: string;
  alt: string;
  caption: Descendant[];
  url?: string;
  focalX?: string;
  focalY?: string;
  lowerRightY?: string;
  lowerRightX?: string;
  upperLeftY?: string;
  upperLeftX?: string;
  metaData?: any;
  border?: boolean;
  isDecorative: boolean;
  hideByline?: boolean;
}

const formRules: RulesType<ImageEmbedFormValues> = {
  alt: {
    test: (values) => {
      if (!values.alt && !values.isDecorative) {
        return { translationKey: "form.image.alt.noText" };
      }
    },
  },
};

const toImageEmbedFormvalues = (embed: ImageEmbedData): ImageEmbedFormValues => {
  return {
    alt: embed.alt,
    caption: inlineContentToEditorValue(embed.caption ?? "", true),
    isDecorative: embed.isDecorative === "true",
    border: embed.border === "true",
    focalX: embed.focalX,
    focalY: embed.focalY,
    upperLeftX: embed.upperLeftX,
    upperLeftY: embed.upperLeftY,
    lowerRightX: embed.lowerRightX,
    lowerRightY: embed.lowerRightY,
    align: embed.align,
    size: embed.size?.replace("hide-byline", ""),
    hideByline: !!embed.size?.includes("hide-byline"),
  };
};

const ImageEmbedForm = ({ embed, onSave, onClose, language, allowDecorative, image }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => {
    return toImageEmbedFormvalues(embed);
  }, [embed]);

  const handleSave = (values: ImageEmbedFormValues) => {
    onSave({
      resource: "image",
      resourceId: embed.resourceId,
      alt: values.alt,
      caption: inlineContentToHTML(values.caption),
      isDecorative: values.isDecorative ? "true" : "false",
      border: values.border ? "true" : "false",
      focalX: values.focalX,
      focalY: values.focalY,
      upperLeftX: values.upperLeftX,
      upperLeftY: values.upperLeftY,
      lowerRightX: values.lowerRightX,
      lowerRightY: values.lowerRightY,
      align: values.align,
      size: values.hideByline ? `${values.size}-hide-byline` : values.size,
    });
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, formRules, t)}
    >
      <EmbedForm onClose={onClose} language={language} allowDecorative={allowDecorative} image={image} />
    </Formik>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: ${stackOrder.offsetSingle};
`;

const EmbedForm = ({
  onClose,
  language,
  allowDecorative,
  image,
}: Pick<Props, "onClose" | "language" | "allowDecorative" | "image">) => {
  const { t } = useTranslation();
  const inGrid = useInGrid();
  const { values, initialValues, isValid, setFieldValue, dirty, isSubmitting } =
    useFormikContext<ImageEmbedFormValues>();

  const formIsDirty = isFormikFormDirty({
    values,
    initialValues,
    dirty,
  });
  return (
    <Form>
      {!!image && <ImageEditor language={language} image={image} />}
      <StyledInputWrapper>
        <div>
          <Text textStyle="label-small" margin="none">
            {t("form.image.caption.label")}
            <RichTextIndicator />
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
          <ButtonV2 onClick={onClose} variant="outline">
            {t("form.abort")}
          </ButtonV2>
          <ButtonV2 disabled={!formIsDirty || !isValid} type="submit">
            {t("form.image.save")}
          </ButtonV2>
        </ButtonWrapper>
      </StyledInputWrapper>
    </Form>
  );
};

export default ImageEmbedForm;
