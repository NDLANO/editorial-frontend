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
import { Button, DialogBody, DialogHeader, DialogTitle, IconButton } from "@ndla/primitives";
import { getRephrasing } from "./utils";
import { useArticleLanguage } from "../../ArticleLanguageProvider";

interface Props {
  selection: BaseRange | null;
  setSelection: Dispatch<SetStateAction<BaseRange | null>>;
}

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

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("textGeneration.alternativePhrasing.title")}</DialogTitle>
        <IconButton
          variant="clear"
          title={t("form.close")}
          aria-label={t("form.close")}
          onClick={() => setSelection(null)}
        >
          <Cross />
        </IconButton>
      </DialogHeader>
      <DialogBody>
        <div>{inputText}</div>
        <Button size="small" onClick={generateRephrasedText}>
          {t("textGeneration.alternativePhrasing.button")}
        </Button>
        <div>{rephrasedText}</div>
      </DialogBody>
    </>
  );
};

export default RephraseModalContent;
