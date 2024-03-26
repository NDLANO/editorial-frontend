/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant, Node } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CheckboxItem, Label, RadioButtonItem, RadioButtonGroup, FieldErrorMessage, InputV3 } from "@ndla/forms";
import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { HeadingLevel, Text } from "@ndla/typography";
import { TYPE_CAMPAIGN_BLOCK } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import parseMarkdown from "../../../../util/parseMarkdown";
import { FormRemainingCharacters } from "../../../Form/FormRemainingCharacters";
import { CheckboxWrapper, RadioButtonWrapper, FieldsetRow, StyledFormControl, LeftLegend } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  initialData?: CampaignBlockEmbedData;
  onSave: (data: CampaignBlockEmbedData) => void;
  onCancel: () => void;
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
    resource: TYPE_CAMPAIGN_BLOCK,
    title: inlineContentToEditorValue(parseMarkdown({ markdown: initialData?.title ?? "", inline: true }), true),
    description: inlineContentToEditorValue(
      parseMarkdown({ markdown: initialData?.description ?? "", inline: true }),
      true,
    ),
    metaImageId: initialData?.imageId,
    imageSide: initialData?.imageSide ?? "left",
    headingLevel: initialData?.headingLevel ?? "h2",
    link: initialData?.url,
    linkText: inlineContentToEditorValue(parseMarkdown({ markdown: initialData?.urlText ?? "", inline: true }), true),
    metaImageAlt: initialData?.alt ?? "",
    isDecorative: initialData ? initialData.alt === undefined : false,
  };
};

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const UrlWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  > * {
    flex: 1;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const placements: CampaignBlockEmbedData["imageSide"][] = ["left", "right"];

const CampaignBlockForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: CampaignBlockFormValues) => {
      onSave({
        resource: TYPE_CAMPAIGN_BLOCK,
        headingLevel: values.headingLevel,
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
      {({ dirty, isValid, isSubmitting, values }) => (
        <StyledForm>
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
          <div>
            <Text textStyle="label-small" margin="none">
              {t("form.name.description")}
              <RichTextIndicator />
            </Text>
            <FormField name="description">
              {({ field, helpers, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <InlineField
                    {...field}
                    maxLength={250}
                    placeholder={t("form.name.description")}
                    submitted={isSubmitting}
                    onChange={helpers.setValue}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <FormRemainingCharacters value={Node.string(field.value[0]).length} maxLength={250} />
                </FormControl>
              )}
            </FormField>
          </div>
          <UrlWrapper>
            <FormField name="link">
              {({ field, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <Label margin="none" textStyle="label-small">
                    {t("form.name.link")}
                  </Label>
                  <InputV3 {...field} placeholder={t("form.name.link")} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
            <div>
              <Text textStyle="label-small" margin="none">
                {t("form.name.linkText")}
                <RichTextIndicator />
              </Text>
              <FormField name="linkText">
                {({ field, helpers, meta }) => (
                  <FormControl isInvalid={!!meta.error}>
                    <InlineField
                      {...field}
                      placeholder={t("form.name.linkText")}
                      submitted={isSubmitting}
                      onChange={helpers.setValue}
                    />
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  </FormControl>
                )}
              </FormField>
            </div>
          </UrlWrapper>
          <FormField name="imageSide">
            {({ field, helpers }) => (
              <StyledFormControl>
                <RadioButtonGroup
                  onValueChange={(value: string) => helpers.setValue(value)}
                  orientation="horizontal"
                  defaultValue={field.value}
                  asChild
                >
                  <FieldsetRow>
                    <LeftLegend margin="none" textStyle="label-small">
                      {t("form.name.sides")}
                    </LeftLegend>
                    {imagePlacementOptions.map((value) => (
                      <RadioButtonWrapper key={value.value}>
                        <RadioButtonItem id={`placement-${value.value}`} value={value.value} />
                        <Label htmlFor={`placement-${value.value}`} margin="none" textStyle="label-small">
                          {value.title}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </FieldsetRow>
                </RadioButtonGroup>
              </StyledFormControl>
            )}
          </FormField>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {!values.isDecorative && !!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <Label margin="none" textStyle="label-small">
                    {t("form.name.metaImageAlt")}
                  </Label>
                  <InputV3 {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          )}
          {!!values.metaImageId && (
            <FormField name="isDecorative">
              {({ field, meta, helpers }) => (
                <FormControl isInvalid={!!meta.error}>
                  <CheckboxWrapper>
                    <CheckboxItem checked={field.value} onCheckedChange={helpers.setValue} />
                    <Label margin="none" textStyle="label-small">
                      {t("form.image.isDecorative")}
                    </Label>
                  </CheckboxWrapper>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          )}
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2
              variant="solid"
              disabled={!isFormikFormDirty({ values, initialValues, dirty }) || !isValid}
              type="submit"
            >
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default CampaignBlockForm;
