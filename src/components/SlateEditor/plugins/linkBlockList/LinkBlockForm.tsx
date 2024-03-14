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
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from "@ndla/modal";
import { LinkBlockEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import InlineDatePicker from "../../../../containers/FormikForm/components/InlineDatePicker";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { formatDateForBackend } from "../../../../util/formatDate";
import parseMarkdown from "../../../../util/parseMarkdown";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  embed?: LinkBlockEmbedData;
  existingEmbeds: LinkBlockEmbedData[];
  onSave: (embed: LinkBlockEmbedData) => void;
}

interface LinkBlockFormValues extends Omit<LinkBlockEmbedData, "date" | "title"> {
  date?: Date;
  title: Descendant[];
}

const toInitialValues = (initialData: LinkBlockEmbedData | undefined): LinkBlockFormValues => {
  return {
    resource: "link-block",
    title: inlineContentToEditorValue(parseMarkdown({ markdown: initialData?.title ?? "", inline: true }), true),
    date: initialData?.date ? new Date(initialData.date) : undefined,
    url: initialData?.url ?? "",
  };
};

const ButtonContainer = styled.div`
  padding-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const DateWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const LinkBlockForm = ({ embed, existingEmbeds, onSave }: Props) => {
  const { t } = useTranslation();

  const rules: RulesType<LinkBlockFormValues> = useMemo(() => {
    return {
      title: {
        required: true,
      },
      date: {
        required: false,
      },
      url: {
        required: true,
        url: true,
        test: (value) => {
          const exists = existingEmbeds.some((embed) => embed.url === value.url);
          if (!exists) return undefined;
          return { translationKey: "linkBlock.linkExists" };
        },
      },
    };
  }, [existingEmbeds]);

  const validate = useCallback(
    (values: LinkBlockFormValues) => {
      return validateFormik(values, rules, t);
    },
    [t, rules],
  );

  const onFormSaved = useCallback(
    ({ date, title, url }: LinkBlockFormValues) => {
      const embed = {
        resource: "link-block",
        title: inlineContentToHTML(title),
        date: date ? formatDateForBackend(new Date(date)) : "",
        url,
      } as const;
      onSave(embed);
    },
    [onSave],
  );

  const initialValues = useMemo(() => toInitialValues(embed), [embed]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t, rules]);

  return (
    <>
      <ModalHeader>
        <ModalTitle>{embed ? t("linkBlock.edit") : t("linkBlock.create")}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          initialErrors={initialErrors}
          validateOnMount
          onSubmit={onFormSaved}
          validate={validate}
        >
          {({ dirty, isValid, isSubmitting }) => {
            return (
              <StyledForm>
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
                <FormField name="url">
                  {({ field, meta }) => (
                    <FormControl isInvalid={!!meta.error}>
                      <Label margin="none" textStyle="label-small">
                        {t("form.name.url")}
                      </Label>
                      <InputV3 {...field} />
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    </FormControl>
                  )}
                </FormField>
                <FormField name="date">
                  {({ field, meta, helpers }) => (
                    <FormControl isInvalid={!!meta.error}>
                      <Label margin="none" textStyle="label-small">
                        {t("form.name.date")}
                      </Label>
                      <DateWrapper>
                        <InlineDatePicker placeholder={t("linkBlock.chooseDate")} {...field} />
                        <ButtonV2 onClick={() => helpers.setValue("")}>{t("reset")}</ButtonV2>
                      </DateWrapper>
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    </FormControl>
                  )}
                </FormField>
                <ButtonContainer>
                  <ModalCloseButton>
                    <ButtonV2 variant="outline">{t("cancel")}</ButtonV2>
                  </ModalCloseButton>
                  <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit">
                    {t("save")}
                  </ButtonV2>
                </ButtonContainer>
              </StyledForm>
            );
          }}
        </Formik>
      </ModalBody>
    </>
  );
};

export default LinkBlockForm;
