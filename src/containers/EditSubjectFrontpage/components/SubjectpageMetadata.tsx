/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldHelper, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SubjectpageBanner from "./SubjectpageBanner";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";

const ImageWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "small",
  },
});

const StyledFormRemainingCharacters = styled(FormRemainingCharacters, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  isSubmitting: boolean;
}

const SubjectpageMetadata = ({ isSubmitting }: Props) => {
  const { t } = useTranslation();
  const plugins = [textTransformPlugin];
  return (
    <FormContent>
      <FormField name="metaDescription">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.metaDescription.label")}</FieldLabel>
            <FieldHelper>{t("form.metaDescription.description")}</FieldHelper>
            <PlainTextEditor
              id={field.name}
              {...field}
              submitted={isSubmitting}
              placeholder={t("form.metaDescription.label")}
              plugins={plugins}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledFormRemainingCharacters maxLength={300} value={field.value} />
          </FieldRoot>
        )}
      </FormField>

      <ImageWrapper>
        <FormField name="desktopBannerId">
          {() => <SubjectpageBanner title={t("form.name.desktopBannerId")} fieldName={"desktopBannerId"} />}
        </FormField>
        <FormField name="mobileBannerId">
          {() => <SubjectpageBanner title={t("form.name.mobileBannerId")} fieldName={"mobileBannerId"} />}
        </FormField>
      </ImageWrapper>
    </FormContent>
  );
};

export default SubjectpageMetadata;
