/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FootnoteElement } from ".";
import MultiSelectDropdown from "../../../Dropdown/MultiSelectDropdown";
import FormikField from "../../../FormikField";
import validateFormik from "../../../formikValidationSchema";

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  gap: ${spacing.xsmall};
  justify-content: flex-end;
`;

const rules = {
  title: { required: true },
  year: { required: true, minLength: 4, maxLength: 4, numeric: true },
  authors: { minItems: 1 },
};

const getInitialValues = (footnote: FootnoteElement["data"] | undefined): FootnoteFormikValues => ({
  title: footnote?.title || "",
  year: footnote?.year || "",
  resource: footnote?.resource || "footnote",
  authors: footnote?.authors?.map((author) => ({ id: author })) || [],
  edition: footnote?.edition || "",
  publisher: footnote?.publisher || "",
  type: footnote?.type || "",
});

interface FootnoteFormikValues {
  title: string;
  year: string;
  resource: string;
  authors: { id: string }[];
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

  const handleSave = async (values: FootnoteFormikValues, actions: FormikHelpers<FootnoteFormikValues>) => {
    const { setSubmitting } = actions;
    setSubmitting(true);
    await onSave({ ...values, authors: values.authors.map((auth) => auth.id) });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(footnote)}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, rules, t, "footnoteForm")}
    >
      {({ submitForm }) => (
        <Form>
          <FormikField name="title" label={t("form.content.footnote.title")} />
          <FormikField name="year" label={t("form.content.footnote.year")} />
          <FormikField name="authors" label={t("form.content.footnote.authors.label")} obligatory>
            {({ field }) => (
              <MultiSelectDropdown
                labelField={"id"}
                showCreateOption
                shouldCreate={(allValues, newValue) => !allValues.some((v) => v.id === newValue.id)}
                {...field}
              />
            )}
          </FormikField>
          <FormikField name="edition" label={t("form.content.footnote.edition")} />

          <FormikField name="publisher" label={t("form.content.footnote.publisher")} />
          <ButtonContainer>
            {isEdit && <ButtonV2 onClick={onRemove}>{t("form.content.footnote.removeFootnote")}</ButtonV2>}
            <ButtonV2 variant="outline" onClick={onClose}>
              {t("form.abort")}
            </ButtonV2>
            <ButtonV2 data-testid="save_footnote" onClick={submitForm}>
              {t("form.save")}
            </ButtonV2>
          </ButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default FootnoteForm;
