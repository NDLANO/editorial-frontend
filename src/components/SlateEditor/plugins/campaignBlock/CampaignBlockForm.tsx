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
import { CheckboxIndicator } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  DialogCloseTrigger,
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
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { HeadingLevel } from "@ndla/ui";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormRemainingCharacters } from "../../../Form/FormRemainingCharacters";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  initialData?: CampaignBlockEmbedData;
  onSave: (data: CampaignBlockEmbedData) => void;
}

export interface CampaignBlockFormValues {
  resource: "campaign-block";
  title: Descendant[];
  description: Descendant[];
  headingLevel: HeadingLevel;
  link?: string;
  linkText?: Descendant[];
  metaImageId?: string;
  imageSide?: CampaignBlockEmbedData["imageSide"];
  metaImageAlt?: string;
  isDecorative?: boolean;
}

const rules: RulesType<CampaignBlockFormValues> = {
  title: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 250,
  },
  headingLevel: {
    required: true,
  },
  link: {
    required: true,
    url: true,
    onlyValidateIf: (value) => !!value.linkText || !!value.link,
  },
  linkText: {
    required: true,
    onlyValidateIf: (value) => !!value.link,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (value) => !!value.metaImageId && !value.isDecorative,
  },
};

const toInitialValues = (initialData?: CampaignBlockEmbedData): CampaignBlockFormValues => {
  return {
    resource: CAMPAIGN_BLOCK_ELEMENT_TYPE,
    title: inlineContentToEditorValue(initialData?.title ?? "", true),
    description: inlineContentToEditorValue(initialData?.description ?? "", true),
    metaImageId: initialData?.imageId,
    imageSide: initialData?.imageSide ?? "left",
    headingLevel: initialData?.headingLevel ?? "h2",
    link: initialData?.url,
    linkText: inlineContentToEditorValue(initialData?.urlText ?? "", true),
    metaImageAlt: initialData?.alt ?? "",
    isDecorative: initialData ? initialData.alt === undefined : false,
  };
};

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const UrlWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "xsmall",
  },
});

const placements: CampaignBlockEmbedData["imageSide"][] = ["left", "right"];

const CampaignBlockForm = ({ initialData, onSave }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: CampaignBlockFormValues) => {
      onSave({
        resource: CAMPAIGN_BLOCK_ELEMENT_TYPE,
        // TODO: The headingLevel type should be shared between all components
        headingLevel: values.headingLevel as "h2",
        title: inlineContentToHTML(values.title),
        description: inlineContentToHTML(values.description),
        imageSide: values.imageSide,
        url: values.link,
        urlText: inlineContentToHTML(values.linkText ?? []),
        imageId: values.metaImageId,
        alt: values.isDecorative ? undefined : values.metaImageAlt,
      });
    },
    [onSave],
  );

  const onValidate = useCallback((values: CampaignBlockFormValues) => validateFormik(values, rules, t), [t]);

  const imagePlacementOptions = useMemo(
    () =>
      placements.map((value) => ({
        title: t(`campaignBlockForm.sides.${value}`),
        value: value!,
      })),
    [t],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={onValidate}
    >
      {({ dirty, isValid, isSubmitting, values, setFieldValue, setFieldTouched }) => (
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
            {({ field, helpers, meta }) => (
              <FieldRoot invalid={!!meta.error}>
                <ContentEditableFieldLabel>
                  {t("form.name.description")}
                  <RichTextIndicator />
                </ContentEditableFieldLabel>
                <InlineField
                  {...field}
                  maxLength={250}
                  placeholder={t("form.name.description")}
                  submitted={isSubmitting}
                  onChange={helpers.setValue}
                />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                <FormRemainingCharacters value={field.value} maxLength={250} />
              </FieldRoot>
            )}
          </FormField>
          <UrlWrapper>
            <FormField name="link">
              {({ field, meta }) => (
                <FieldRoot invalid={!!meta.error}>
                  <FieldLabel>{t("form.name.link")}</FieldLabel>
                  <FieldInput {...field} placeholder={t("form.name.link")} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
            <FormField name="linkText">
              {({ field, helpers, meta }) => (
                <FieldRoot invalid={!!meta.error}>
                  <ContentEditableFieldLabel>
                    {t("form.name.linkText")}
                    <RichTextIndicator />
                  </ContentEditableFieldLabel>
                  <InlineField
                    {...field}
                    placeholder={t("form.name.linkText")}
                    submitted={isSubmitting}
                    onChange={helpers.setValue}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FieldRoot>
              )}
            </FormField>
          </UrlWrapper>
          <FormField name="imageSide">
            {({ field, helpers }) => (
              <FieldRoot>
                <RadioGroupRoot
                  value={field.value}
                  orientation="horizontal"
                  onValueChange={(details) => helpers.setValue(details.value)}
                >
                  <RadioGroupLabel>{t("form.name.sides")}</RadioGroupLabel>
                  {imagePlacementOptions.map((value) => (
                    <RadioGroupItem value={value.value} key={value.value}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{value.title}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput />
                    </RadioGroupItem>
                  ))}
                </RadioGroupRoot>
              </FieldRoot>
            )}
          </FormField>
          <InlineImageSearch
            name="metaImageId"
            disableAltEditing
            hideAltText
            values={values}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
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
              {({ field, meta, helpers }) => (
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
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
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

export default CampaignBlockForm;
