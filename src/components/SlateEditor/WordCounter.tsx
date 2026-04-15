/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger, Text } from "@ndla/primitives";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Descendant, Node } from "slate";
import { LearningResourceFormType } from "../../containers/FormikForm/articleFormHooks";

const calculateCounts = (content: Descendant[]) => {
  const texts: string[] = [];
  for (const node of content) {
    for (const [leaf] of Node.texts(node)) {
      texts.push(leaf.text);
    }
  }
  // Join with space only for word splitting, to avoid merging words at block boundaries.
  // Character counts use the raw concatenation so artificial separators aren't counted.
  const wordText = texts.join(" ").trim();
  const rawText = texts.join("");
  const words = wordText === "" ? 0 : wordText.split(/\s+/).filter(Boolean).length;
  const charactersWithSpaces = rawText.length;
  const charactersWithoutSpaces = rawText.replace(/\s/g, "").length;
  return { words, charactersWithSpaces, charactersWithoutSpaces };
};

export const WordCounter = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<LearningResourceFormType>();
  const { words, charactersWithSpaces, charactersWithoutSpaces } = calculateCounts(values.content);
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="tertiary" size="small">
          {t("editorFooter.wordCount", { count: words })}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle srOnly>{t("editorFooter.editorInfoTitle")}</PopoverTitle>
        <Text>{t("editorFooter.wordCount", { count: words })}</Text>
        <Text>{t("editorFooter.charactersCount", { count: charactersWithSpaces })}</Text>
        <Text>{t("editorFooter.charactersCountWithoutSpaces", { count: charactersWithoutSpaces })}</Text>
      </PopoverContent>
    </PopoverRoot>
  );
};
