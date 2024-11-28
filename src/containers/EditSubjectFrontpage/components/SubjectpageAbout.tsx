/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldLabel, FieldRoot, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { TitleField } from "../../FormikForm";
import VisualElementField from "../../FormikForm/components/VisualElementField";

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});
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
    <FormContent>
      <TitleField hideToolbar />
      <FormField name="description">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel srOnly>{t("subjectpageForm.description")}</FieldLabel>
            <PlainTextEditor id={field.name} placeholder={t("subjectpageForm.description")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledFormRemainingCharacters maxLength={300} value={field.value} />
          </FieldRoot>
        )}
      </FormField>
      <VisualElementField types={["image", "video"]} />
    </FormContent>
  );
};

export default SubjectpageAbout;
