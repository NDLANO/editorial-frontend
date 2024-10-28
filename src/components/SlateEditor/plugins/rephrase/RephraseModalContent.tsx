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
  const language = useArticleLanguage();
  const [rephrasedText, setRephrasedText] = useState<string>("");

  const inputText = useMemo(() => {
    if (!selection) return "";
    return Editor.string(editor, selection);
  }, [editor, selection]);

  const generateRephrasedText = async () => {
    if (!inputText) return;
    const response = await getRephrasing(
      t("textGeneration.alternativePhrasing.prompt", { language: t(`languages.${language}`) }) + inputText,
    );
    response && setRephrasedText(response);
  };

  const insertGeneratedText = () => {
    //console.log("Inserting text");
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
            <h2>Tekst som skal omformuleres</h2>
          </Heading>
          <TextBox>{inputText}</TextBox>
        </div>
        <div>
          <Heading asChild consumeCss textStyle="label.medium">
            <h2>Foreslått omformulering</h2>
          </Heading>
          <TextBox>{rephrasedText}</TextBox>
        </div>
        <Actions>
          <Button size="small" onClick={generateRephrasedText}>
            {t("textGeneration.alternativePhrasing.button")}
            <BlogPost />
          </Button>
          <Button size="small" onClick={() => setSelection(null)} variant="secondary">
            {t("dialog.close")}
          </Button>
          <Button size="small" onClick={insertGeneratedText}>
            {t("textGeneration.alternativePhrasing.button")}
          </Button>
        </Actions>
      </DialogBody>
    </>
  );
};

export default RephraseModalContent;
