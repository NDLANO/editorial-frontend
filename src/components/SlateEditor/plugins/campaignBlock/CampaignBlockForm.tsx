/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Field, FieldProps, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CheckboxItem, InputV2, TextAreaV2, RadioButtonGroup, Label, RadioButtonItem } from "@ndla/forms";
import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { HeadingLevel } from "@ndla/typography";
import { TYPE_CAMPAIGN_BLOCK } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { frontpageLanguages } from "../../../../i18n2";
import {
  CheckboxWrapper,
  StyledFieldset,
  StyledFormControl,
  StyledRadioButtonGroup,
  StyledText,
} from "../../../Form/styles";
import { FormControl } from "../../../FormField";
import FormikField from "../../../FormikField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface Props {
  initialData?: CampaignBlockEmbedData;
  onSave: (data: CampaignBlockEmbedData) => void;
  onCancel: () => void;
}

export interface CampaignBlockFormValues {
  resource: "campaign-block";
  title: string;
  titleLanguage: string;
  description: string;
  descriptionLanguage: string;
  headingLevel: HeadingLevel;
  link?: string;
  linkText?: string;
  metaImageId?: string;
  imageSide?: CampaignBlockEmbedData["imageSide"];
  metaImageAlt?: string;
  isDecorative?: boolean;
}

const rules: RulesType<CampaignBlockFormValues> = {
  title: {
    required: true,
  },
  titleLanguage: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 250,
  },
  descriptionLanguage: {
    required: true,
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

const toInitialValues = (lang: string, initialData?: CampaignBlockEmbedData): CampaignBlockFormValues => {
  return {
    resource: TYPE_CAMPAIGN_BLOCK,
    title: initialData?.title ?? "",
    titleLanguage: initialData?.titleLanguage ?? lang,
    description: initialData?.description ?? "",
    descriptionLanguage: initialData?.descriptionLanguage ?? lang,
    metaImageId: initialData?.imageId,
    imageSide: initialData?.imageSide ?? "left",
    headingLevel: initialData?.headingLevel ?? "h2",
    link: initialData?.url,
    linkText: initialData?.urlText,
    metaImageAlt: initialData?.alt ?? "",
    isDecorative: initialData ? initialData.alt === undefined : false,
  };
};

const inputStyle = css`
  display: flex;
  flex-direction: column;
  & > label {
    white-space: nowrap;
  }
`;

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const StyledUrlFormikField = styled(FormikField)`
  margin: 0px;
  flex: 1;
`;

const StyledSelect = styled.select`
  background-color: transparent;
  border: none;
`;

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const UrlWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const placement: CampaignBlockEmbedData["imageSide"][] = ["left", "right"];

const CampaignBlockForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t, i18n } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(i18n.language, initialData), [initialData, i18n.language]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: CampaignBlockFormValues) => {
      onSave({
        resource: TYPE_CAMPAIGN_BLOCK,
        headingLevel: values.headingLevel,
        title: values.title,
        titleLanguage: values.titleLanguage,
        description: values.description,
        descriptionLanguage: values.descriptionLanguage,
        imageSide: values.imageSide,
        url: values.link,
        urlText: values.linkText,
        imageId: values.metaImageId,
        alt: values.isDecorative ? undefined : values.metaImageAlt,
      });
    },
    [onSave],
  );

  const onValidate = useCallback((values: CampaignBlockFormValues) => validateFormik(values, rules, t), [t]);

  const imagePlacementOptions = useMemo(
    () =>
      placement.map((value) => ({
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
      {({ dirty, isValid, handleSubmit }) => (
        <>
          <StyledFormikField name="title" showError>
            {({ field }: FieldProps) => (
              <InputV2
                customCss={inputStyle}
                label={t("form.name.title")}
                {...field}
                after={
                  <StyledFormikField name="titleLanguage">
                    {({ field }: FieldProps) => (
                      <StyledSelect {...field} title={t("blogPostForm.languageExplanation")}>
                        {frontpageLanguages.map((lang) => (
                          <option value={lang} key={lang}>
                            {t(`languages.${lang}`)}
                          </option>
                        ))}
                      </StyledSelect>
                    )}
                  </StyledFormikField>
                }
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="description" showError maxLength={250} showMaxLength>
            {({ field }: FieldProps) => (
              <TextAreaV2
                customCss={inputStyle}
                label={t("form.name.description")}
                {...field}
                after={
                  <StyledFormikField name="descriptionLanguage">
                    {({ field }: FieldProps) => (
                      <StyledSelect {...field} title={t("blogPostForm.languageExplanation")}>
                        {frontpageLanguages.map((lang) => (
                          <option value={lang} key={lang}>
                            {t(`languages.${lang}`)}
                          </option>
                        ))}
                      </StyledSelect>
                    )}
                  </StyledFormikField>
                }
              />
            )}
          </StyledFormikField>
          <UrlWrapper>
            <StyledUrlFormikField name="link" showError>
              {({ field }: FieldProps) => <InputV2 customCss={inputStyle} label={t("form.name.link")} {...field} />}
            </StyledUrlFormikField>
            <StyledUrlFormikField name="linkText" showError>
              {({ field }: FieldProps) => <InputV2 customCss={inputStyle} label={t("form.name.linkText")} {...field} />}
            </StyledUrlFormikField>
          </UrlWrapper>
          <Field name="imageSide">
            {({ field }: FieldProps) => (
              <StyledFieldset>
                <StyledText margin="none" textStyle="label-small" element="legend">
                  {t("form.name.sides")}
                </StyledText>
                <StyledRadioButtonGroup
                  onValueChange={(value: string) =>
                    field.onChange({
                      target: {
                        name: field.name,
                        value: value,
                      },
                    })
                  }
                  orientation="horizontal"
                  defaultValue={field.value}
                >
                  {imagePlacementOptions.map((option) => (
                    <StyledFormControl id={option.value} key={option.value}>
                      <RadioButtonItem value={option.value} />
                      <Label margin="none" textStyle="label-small">
                        {option.title}
                      </Label>
                    </StyledFormControl>
                  ))}
                </StyledRadioButtonGroup>
              </StyledFieldset>
            )}
          </Field>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          <StyledFormikField name="metaImageAlt">
            {({ field, form }: FieldProps) => (
              <>
                {!form.values.isDecorative && form.values.metaImageId && (
                  <InputV2 customCss={inputStyle} label={t("form.name.metaImageAlt")} {...field} />
                )}
              </>
            )}
          </StyledFormikField>
          <Field name="isDecorative">
            {({ field, form }: FieldProps) => (
              <>
                {form.values.metaImageId && (
                  <FormControl>
                    <CheckboxWrapper>
                      <CheckboxItem
                        checked={field.value}
                        onCheckedChange={() =>
                          field.onChange({
                            target: { name: field.name, value: !field.value },
                          })
                        }
                      />
                      <Label margin="none" textStyle="label-small">
                        {t("form.image.isDecorative")}
                      </Label>
                    </CheckboxWrapper>
                  </FormControl>
                )}
              </>
            )}
          </Field>
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit" onClick={() => handleSubmit()}>
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </>
      )}
    </Formik>
  );
};

export default CampaignBlockForm;
