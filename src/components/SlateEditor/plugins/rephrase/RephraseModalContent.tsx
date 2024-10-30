/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseRange, Editor } from "slate";
import { useSlate } from "slate-react";
import { Cross } from "@ndla/icons/action";
import { BlogPost } from "@ndla/icons/editor";
import { Button, DialogBody, DialogHeader, DialogTitle, Heading, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { getRephrasing } from "./utils";
import { editorValueToPlainText } from "../../../../util/articleContentConverter";
import { useArticleLanguage } from "../../ArticleLanguageProvider";

interface Props {
  selection: BaseRange | null;
  setSelection: Dispatch<SetStateAction<BaseRange | null>>;
}

const TextBox = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "primary",
    borderRadius: "small",
    padding: "small",
  },
});

const Actions = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    justifyContent: "flex-end",
  },
});

const RephraseModalContent = ({ selection, setSelection }: Props) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const { children: editorChildren, insertText } = editor;
  const language = useArticleLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rephrasedText, setRephrasedText] = useState<string>("");

  const inputText = useMemo(() => {
    if (!selection) return "";
    return Editor.string(editor, selection);
  }, [editor, selection]);

  const generateRephrasedText = async () => {
    if (!inputText) return;
    const articleText = editorValueToPlainText(editorChildren);
    setIsLoading(true);
    const response = await getRephrasing(
      t("textGeneration.alternativePhrasing.prompt", {
        article: articleText,
        excerpt: inputText,
        language: t(`languages.${language}`),
      }),
    );
    response && setRephrasedText(response);
    setIsLoading(false);
  };

  const replaceSelectedText = () => {
    insertText(rephrasedText);
    setSelection(null);
  };

  const addTextAfterSelection = () => {
    insertText(inputText + rephrasedText);
    setSelection(null);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("textGeneration.alternativePhrasing.title")}</DialogTitle>
        <IconButton
          variant="clear"
          title={t("dialog.close")}
          aria-label={t("dialog.close")}
          onClick={() => setSelection(null)}
        >
          <Cross />
        </IconButton>
      </DialogHeader>
      <DialogBody>
        <div>
          <Heading asChild consumeCss textStyle="label.medium">
            <h2>{t("textGeneration.alternativePhrasing.textCurrent")}</h2>
          </Heading>
          <TextBox>{inputText}</TextBox>
        </div>
        <Button
          aria-label={t("textGeneration.alternativePhrasing.buttons.generate.title")}
          size="small"
          title={t("textGeneration.alternativePhrasing.buttons.generate.title")}
          onClick={generateRephrasedText}
          loading={isLoading}
        >
          {t("textGeneration.alternativePhrasing.buttons.generate.text")}
          <BlogPost />
        </Button>
        <div>
          <Heading asChild consumeCss textStyle="label.medium">
            <h2>{t("textGeneration.alternativePhrasing.textSuggested")}</h2>
          </Heading>
          <TextBox>{rephrasedText}</TextBox>
        </div>
        <Actions>
          <Button size="small" onClick={() => setSelection(null)} variant="secondary">
            {t("dialog.close")}
          </Button>
          <Button
            aria-label={t("textGeneration.alternativePhrasing.buttons.add.title")}
            size="small"
            title={t("textGeneration.alternativePhrasing.buttons.add.title")}
            onClick={addTextAfterSelection}
          >
            {t("textGeneration.alternativePhrasing.buttons.add.text")}
          </Button>
          <Button
            aria-label={t("textGeneration.alternativePhrasing.buttons.replace.title")}
            size="small"
            title={t("textGeneration.alternativePhrasing.buttons.replace.title")}
            onClick={replaceSelectedText}
          >
            {t("textGeneration.alternativePhrasing.buttons.replace.text")}
          </Button>
        </Actions>
      </DialogBody>
    </>
  );
};

export default RephraseModalContent;
