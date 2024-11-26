/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { TagsInputContext } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons/action";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Input,
  InputContainer,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputLabel,
  TagsInputRoot,
} from "@ndla/primitives";
import { useTagsInputTranslations } from "@ndla/ui";
import { FootnoteElement } from ".";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik from "../../../formikValidationSchema";

const rules = {
  title: { required: true },
  year: { required: true, minLength: 4, maxLength: 4, numeric: true },
  authors: { minItems: 1 },
};

const getInitialValues = (footnote: FootnoteElement["data"] | undefined): FootnoteFormikValues => ({
  title: footnote?.title || "",
  year: footnote?.year || "",
  resource: footnote?.resource || "footnote",
  authors: footnote?.authors ?? [],
  edition: footnote?.edition || "",
  publisher: footnote?.publisher || "",
  type: footnote?.type || "",
});

interface FootnoteFormikValues {
  title: string;
  year: string;
  resource: string;
  authors: string[];
  edition: string;
  publisher: string;
  type: string;
}

interface Props {
  footnote: FootnoteElement["data"];
  onClose: () => void;
  isEdit: boolean;
  onRemove: () => void;
  onSave: (data: FootnoteElement["data"]) => void;
}

const FootnoteForm = ({ isEdit, footnote, onRemove, onClose, onSave }: Props) => {
  const { t } = useTranslation();
  const tagsInputTranslations = useTagsInputTranslations();

  const handleSave = async (values: FootnoteFormikValues, actions: FormikHelpers<FootnoteFormikValues>) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    await onSave({ ...values, authors: values.authors });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(footnote)}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, rules, t, "footnoteForm")}
    >
      <FormikForm>
        <FormField name="title">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error} required>
              <FieldLabel>{t("form.content.footnote.title")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldInput {...field} />
            </FieldRoot>
          )}
        </FormField>
        <FormField name="year">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error} required>
              <FieldLabel>{t("form.content.footnote.year")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldInput {...field} />
            </FieldRoot>
          )}
        </FormField>
        <FormField name="authors">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error} required>
              <TagsInputRoot
                editable
                translations={tagsInputTranslations}
                value={field.value}
                onValueChange={(details) => {
                  helpers.setValue(details.value);
                }}
              >
                <TagsInputLabel>{t("form.content.footnote.authors.label")}</TagsInputLabel>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                <TagsInputContext>
                  {(api) => (
                    <TagsInputControl asChild>
                      <InputContainer>
                        {api.value.map((value, index) => (
                          <TagsInputItem key={index} index={index} value={value}>
                            <TagsInputItemPreview>
                              <TagsInputItemText>{value}</TagsInputItemText>
                              <TagsInputItemDeleteTrigger>
                                <CloseLine />
                              </TagsInputItemDeleteTrigger>
                            </TagsInputItemPreview>
                            <TagsInputItemInput />
                          </TagsInputItem>
                        ))}
                        <TagsInputInput asChild>
                          <Input />
                        </TagsInputInput>
                      </InputContainer>
                    </TagsInputControl>
                  )}
                </TagsInputContext>
              </TagsInputRoot>
            </FieldRoot>
          )}
        </FormField>
        <FormField name="edition">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error} required>
              <FieldLabel>{t("form.content.footnote.edition")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldInput {...field} />
            </FieldRoot>
          )}
        </FormField>

        <FormField name="publisher">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error} required>
              <FieldLabel>{t("form.content.footnote.publisher")}</FieldLabel>
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              <FieldInput {...field} />
            </FieldRoot>
          )}
        </FormField>
        <FormActionsContainer>
          {!!isEdit && (
            <Button variant="danger" onClick={onRemove}>
              {t("form.content.footnote.removeFootnote")}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            {t("form.abort")}
          </Button>
          <Button data-testid="save_footnote" type="submit">
            {t("form.save")}
          </Button>
        </FormActionsContainer>
      </FormikForm>
    </Formik>
  );
};

export default FootnoteForm;
