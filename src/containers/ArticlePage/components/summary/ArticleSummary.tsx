/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, useFormikContext } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";

import { BlogPost } from "@ndla/icons/editor";
import { Button, FieldHelper, FieldLabel, FieldRoot, Spinner, TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FieldHeader from "../../../../components/Field/FieldHeader";
import { FormField } from "../../../../components/FormField";
import { invokeModel } from "../../../../components/LLM/helpers";
import PlainTextEditor from "../../../../components/SlateEditor/PlainTextEditor";
import { inlineContentToEditorValue } from "../../../../util/articleContentConverter";
import { ArticleFormType } from "../../../FormikForm/articleFormHooks";

interface Props {
  articleContent?: string;
}

const StyledButton = styled(Button, {
  base: {
    alignSelf: "flex-start",
  },
});

const ComponentRoot = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const ArticleSummary = ({ articleContent }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setStatus } = useFormikContext<ArticleFormType>();

  const generateSummary = async (helpers: FieldHelperProps<Descendant[]>) => {
    const inputQuery = articleContent ?? "";
    setIsLoading(true);
    try {
      const generatedText = await invokeModel(t("prompts.summary") + inputQuery);
      await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
      // We have to invalidate slate children. We do this with status.
      setStatus({ status: "acceptGenerated" });
    } catch (error) {
      console.error("Error genetating summary", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentRoot>
      <FieldHeader title={t("editorSummary.title")}></FieldHeader>
      <FormField name={t("editorSummary.title")}>
        {({ field, helpers, meta }) => {
          return (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("editorSummary.title")}</FieldLabel>
              <FieldHelper>{t("editorSummary.title")}</FieldHelper>
              <PlainTextEditor key={field.value} id={field.name} placeholder={t("editorSummary.title")} {...field} />
              <StyledButton size="small" onClick={() => generateSummary(helpers)}>
                {t("editorSummary.generate")} {isLoading ? <Spinner size="small" /> : <BlogPost />}
              </StyledButton>
            </FieldRoot>
          );
        }}
      </FormField>
    </ComponentRoot>
  );
};

export default ArticleSummary;
