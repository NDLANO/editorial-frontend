/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Text as SlateText } from "slate";
import { RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { isParagraphElement } from "@ndla/editor";
import { FileListLine } from "@ndla/icons";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogStandaloneContent,
  DialogTitle,
  Heading,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { RephraseElement } from ".";
import { isRephrase, unwrapRephrase } from "./utils";
import { fetchAIGeneratedAnswer } from "../../../../util/llmUtils";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { TYPE_PARAGRAPH } from "../paragraph/types";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: RephraseElement;
  children: JSX.Element[];
}

const TextContainer = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "primary",
    borderRadius: "small",
    padding: "small",
  },
});

// We need to portal both the dialog and the surrounding popover in order to not render invalid HTML in the editor.
// This is a workaround to avoid the popover being rendered above the dialog.
const StyledDialogBackdrop = styled(DialogBackdrop, {
  base: {
    zIndex: "popover",
  },
});
const StyledDialogPositioner = styled(DialogPositioner, {
  base: {
    zIndex: "popover",
  },
});

export const Rephrase = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const language = useArticleLanguage();
  const [generatedText, setGeneratedText] = useState<string | undefined>(undefined);

  const currentText = element.children.find(isParagraphElement)?.children.find(SlateText.isText)?.text ?? "";

  const onClose = () => {
    unwrapRephrase(editor);
  };

  const fetchAiGeneratedText = async () => {
    const res = await fetchAIGeneratedAnswer({
      prompt: t("textGeneration.alternativePhrasing.prompt", {
        article: currentText,
        excerpt: currentText,
        language: t(`language.${language}`),
      }),
    });
    setGeneratedText(res);
  };

  const onReplace = () => {
    if (generatedText) {
      editor.insertText(generatedText, { at: editor.selection?.anchor.path });
    }
    onClose();
  };

  const onAppend = () => {
    if (generatedText) {
      const [entry] = editor.nodes({ match: isRephrase });
      const [_node, path] = entry;
      editor.insertNode({ type: TYPE_PARAGRAPH, children: [{ text: generatedText }] }, { at: Path.next(path) });
    }
    onClose();
  };

  return (
    <div {...attributes}>
      <DialogRoot defaultOpen closeOnInteractOutside closeOnEscape onExitComplete={onClose}>
        <Portal>
          <StyledDialogBackdrop />
          <StyledDialogPositioner>
            <DialogStandaloneContent>
              <DialogHeader>
                <DialogTitle>{t("textGeneration.alternativePhrasing.title")}</DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <div>
                  <Heading asChild consumeCss textStyle="label.medium">
                    <h2>{t("textGeneration.alternativePhrasing.textCurrent")}</h2>
                  </Heading>
                  <TextContainer>
                    <Text>{currentText}</Text>
                  </TextContainer>
                </div>
                <Button
                  aria-label={t("textGeneration.alternativePhrasing.buttons.generate.title")}
                  size="small"
                  title={t("textGeneration.alternativePhrasing.buttons.generate.title")}
                  onClick={fetchAiGeneratedText}
                >
                  {t("textGeneration.alternativePhrasing.buttons.generate.text")}
                  <FileListLine />
                </Button>
                <div>
                  <Heading asChild consumeCss textStyle="label.medium">
                    <h2>{t("textGeneration.alternativePhrasing.textSuggested")}</h2>
                  </Heading>
                  <TextContainer>
                    <Text>{generatedText}</Text>
                  </TextContainer>
                </div>
                <HStack justify="space-between">
                  <Button size="small" onClick={onClose} variant="secondary">
                    {t("dialog.close")}
                  </Button>
                  <HStack gap="small">
                    <Button
                      aria-label={t("textGeneration.alternativePhrasing.buttons.add.title")}
                      size="small"
                      title={t("textGeneration.alternativePhrasing.buttons.add.title")}
                      onClick={onAppend}
                      disabled={!generatedText}
                    >
                      {t("textGeneration.alternativePhrasing.buttons.add.text")}
                    </Button>
                    <Button
                      aria-label={t("textGeneration.alternativePhrasing.buttons.replace.title")}
                      size="small"
                      title={t("textGeneration.alternativePhrasing.buttons.replace.title")}
                      onClick={onReplace}
                      disabled={!generatedText}
                    >
                      {t("textGeneration.alternativePhrasing.buttons.replace.text")}
                    </Button>
                  </HStack>
                </HStack>
              </DialogBody>
            </DialogStandaloneContent>
          </StyledDialogPositioner>
        </Portal>
      </DialogRoot>
      {children}
    </div>
  );
};
