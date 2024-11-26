/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { Spinner } from "@ndla/primitives";
import FormikField from "../../../components/FormikField";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { TitleField } from "../../FormikForm";
import VisualElementField from "../../FormikForm/components/VisualElementField";

interface Props {
  selectedLanguage?: string;
}

const SubjectpageAbout = ({ selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 0);
  }, [selectedLanguage]);

  if (showLoading) {
    return <Spinner />;
  }
  return (
    <>
      <TitleField hideToolbar />
      <FormikField noBorder label={t("subjectpageForm.description")} name="description" showMaxLength maxLength={300}>
        {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            submitted={isSubmitting}
            placeholder={t("subjectpageForm.description")}
          />
        )}
      </FormikField>
      <VisualElementField types={["image", "video"]} />
    </>
  );
};

export default SubjectpageAbout;
