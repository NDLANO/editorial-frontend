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
import { FileListLine } from "@ndla/icons";
import { Button, FieldHelper, FieldLabel, FieldRoot, Spinner, TextArea } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormField } from "../../../../components/FormField";
import { claudeHaikuDefaults, invokeModel } from "../../../../components/LLM/helpers";
import PlainTextEditor from "../../../../components/SlateEditor/PlainTextEditor";
import { inlineContentToEditorValue } from "../../../../util/articleContentConverter";
import { ArticleFormType } from "../../../FormikForm/articleFormHooks";

interface Props {
  articleContent?: string;
  articleLanguage?: string;
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

const ArticleSummary = ({ articleContent, articleLanguage }: Props) => {
  const { t } = useTranslation();
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setStatus } = useFormikContext<ArticleFormType>();

  // const generateSummary = async (helpers: FieldHelperProps<Descendant[]>) => {
  //   const inputQuery = articleContent ?? "";
  //   setIsLoading(true);
  //   try {
  //     const generatedText = await invokeModel(t("textGeneration.articleSummary.prompt") + inputQuery);
  //     await helpers.setValue(inlineContentToEditorValue(generatedText, true), true);
  //     // We have to invalidate slate children. We do this with status.
  //     setStatus({ status: "acceptGenerated" });
  //   } catch (error) {
  //     console.error("Error genetating summary", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const generate = async () => {
    if (!articleContent) {
      console.error("No article content provided to generate meta description");
      return;
    }
    setIsLoading(true);
    try {
      const generatedText = await invokeModel({
        prompt: t("textGeneration.articleSummary.prompt", {
          article: articleContent,
          language: t(`languages.${articleLanguage}`),
        }),
        ...claudeHaikuDefaults,
      });
      generatedText ? setGeneratedSummary(generatedText) : console.error("No generated text");
    } catch (error) {
      console.error("Error genetating summary", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentRoot>
      {/* <FieldHeader title={t("textGeneration.articleSummary.title")}></FieldHeader> */}
      <TextArea onChange={() => {}} value={generatedSummary} />
      <StyledButton size="small" onClick={generate}>
        {t("textGeneration.articleSummary.button")} {isLoading ? <Spinner size="small" /> : <FileListLine />}
      </StyledButton>

      {/* <FormField name={t("textGeneration.articleSummary.title")}>
        {({ field, helpers, meta }) => {
          return (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("textGeneration.articleSummary.title")}</FieldLabel>
              <FieldHelper>{t("textGeneration.articleSummary.title")}</FieldHelper>
              <PlainTextEditor key={field.value} id={field.name} placeholder={t("textGeneration.articleSummary.title")} {...field} />
              <StyledButton size="small" onClick={() => generateSummary(helpers)}>
                {t("textGeneration.articleSummary.button")} {isLoading ? <Spinner size="small" /> : <FileListLine />}
              </StyledButton>
            </FieldRoot>
          );
        }}
      </FormField> */}
    </ComponentRoot>
  );
};

export default ArticleSummary;
