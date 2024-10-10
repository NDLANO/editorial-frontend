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
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LinkBlockEmbedData } from "@ndla/types-embed";
import InlineDatePicker from "../../../../containers/FormikForm/components/InlineDatePicker";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { formatDateForBackend } from "../../../../util/formatDate";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
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
    title: inlineContentToEditorValue(initialData?.title ?? "", true),
    date: initialData?.date ? new Date(initialData.date) : undefined,
    url: initialData?.url ?? "",
  };
};

const DateWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

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
      <DialogHeader>
        <DialogTitle>{embed ? t("linkBlock.edit") : t("linkBlock.create")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Formik
          initialValues={initialValues}
          initialErrors={initialErrors}
          validateOnMount
          onSubmit={onFormSaved}
          validate={validate}
        >
          {({ dirty, isValid, isSubmitting, values }) => {
            return (
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
                <FormField name="url">
                  {({ field, meta }) => (
                    <FieldRoot invalid={!!meta.error}>
                      <FieldLabel>{t("form.name.url")}</FieldLabel>
                      <FieldInput {...field} />
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    </FieldRoot>
                  )}
                </FormField>
                <FormField name="date">
                  {({ field, meta, helpers }) => (
                    <FieldRoot invalid={!!meta.error}>
                      <FieldLabel>{t("form.name.date")}</FieldLabel>
                      <DateWrapper>
                        <InlineDatePicker placeholder={t("linkBlock.chooseDate")} {...field} />
                        <Button onClick={() => helpers.setValue("")}>{t("reset")}</Button>
                      </DateWrapper>
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    </FieldRoot>
                  )}
                </FormField>
                <FormActionsContainer>
                  <DialogCloseTrigger asChild>
                    <Button variant="secondary">{t("cancel")}</Button>
                  </DialogCloseTrigger>
                  <Button disabled={!isFormikFormDirty({ values, initialValues, dirty }) || !isValid} type="submit">
                    {t("save")}
                  </Button>
                </FormActionsContainer>
              </FormikForm>
            );
          }}
        </Formik>
      </DialogBody>
    </>
  );
};

export default LinkBlockForm;
