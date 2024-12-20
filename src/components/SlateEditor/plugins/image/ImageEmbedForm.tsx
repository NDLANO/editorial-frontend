/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { CheckLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldLabel,
  FieldRoot,
  FieldErrorMessage,
  FieldTextArea,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import ImageEditor from "../../../../containers/ImageEditor/ImageEditor";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";
import { useInGrid } from "../grid/GridContext";

interface Props {
  embed: ImageEmbedData;
  image?: IImageMetaInformationV3DTO;
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
    size: embed.size?.replace("--hide-byline", ""),
    hideByline: embed.hideByline === "true",
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
      size: values.size,
      hideByline: `${values.hideByline}`,
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

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const InputWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    paddingInline: "xsmall",
    paddingBlockEnd: "xsmall",
  },
});

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
    <FormikForm>
      {!!image && <ImageEditor language={language} image={image} />}
      <InputWrapper>
        <FormField name="caption">
          {({ field, helpers }) => (
            <FieldRoot>
              <ContentEditableFieldLabel>
                {t("form.image.caption.label")}
                <RichTextIndicator />
              </ContentEditableFieldLabel>
              <InlineField
                {...field}
                placeholder={t("form.image.caption.placeholder")}
                submitted={isSubmitting}
                onChange={helpers.setValue}
              />
            </FieldRoot>
          )}
        </FormField>

        {!values.isDecorative && (
          <FormField name="alt">
            {({ field, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <FieldLabel>{t("form.image.alt.label")}</FieldLabel>
                <FieldTextArea {...field} placeholder={t("form.image.alt.placeholder")} />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FieldRoot>
            )}
          </FormField>
        )}
        {!!allowDecorative && (
          <FormField name="isDecorative">
            {({ field, helpers }) => (
              <FieldRoot>
                <StyledCheckboxRoot
                  checked={field.value}
                  onCheckedChange={(details) => {
                    helpers.setValue(details.checked, false);
                    if (details.checked) {
                      setFieldValue("alt", "", false);
                    }
                  }}
                >
                  <CheckboxLabel>{t("form.image.isDecorative")}</CheckboxLabel>
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxHiddenInput />
                </StyledCheckboxRoot>
              </FieldRoot>
            )}
          </FormField>
        )}
        {!!inGrid && (
          <FormField name="border">
            {({ field, helpers }) => (
              <FieldRoot>
                <StyledCheckboxRoot
                  checked={field.value}
                  onCheckedChange={(details) => helpers.setValue(details.checked, true)}
                >
                  <CheckboxLabel>{t("form.image.showBorder")}</CheckboxLabel>
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxHiddenInput />
                </StyledCheckboxRoot>
              </FieldRoot>
            )}
          </FormField>
        )}
        <FormField name="hideByline">
          {({ field, helpers }) => (
            <FieldRoot>
              <StyledCheckboxRoot
                checked={field.value}
                onCheckedChange={(details) => helpers.setValue(details.checked, true)}
              >
                <CheckboxLabel>{t("form.image.byline.hide")}</CheckboxLabel>
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxHiddenInput />
              </StyledCheckboxRoot>
            </FieldRoot>
          )}
        </FormField>
        <FormActionsContainer>
          <Button onClick={onClose} variant="secondary">
            {t("form.abort")}
          </Button>
          <Button disabled={!formIsDirty || !isValid} type="submit">
            {t("form.image.save")}
          </Button>
        </FormActionsContainer>
      </InputWrapper>
    </FormikForm>
  );
};

export default ImageEmbedForm;
