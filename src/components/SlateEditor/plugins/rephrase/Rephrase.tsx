/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Text as SlateText, Transforms } from "slate";
import { RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
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
  Spinner,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { RephraseElement } from ".";
import { isRephraseElement } from "./utils";
import { useGenerateAlternativePhrasing } from "../../../../modules/llm/llmMutations";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { TYPE_PARAGRAPH } from "../paragraph/types";

interface Props extends RenderElementProps {
  element: RephraseElement;
  editor: Editor;
}

const TextContainer = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "primary",
    borderRadius: "small",
    padding: "small",
  },
});

export const Rephrase = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const language = useArticleLanguage();
  const [generatedText, setGeneratedText] = useState<string | undefined>(undefined);
  const phrasingMutation = useGenerateAlternativePhrasing();

  const currentText = element.children.find(SlateText.isText)?.text ?? "";

  const onClose = () => {
    Transforms.unwrapNodes(editor, {
      match: isRephraseElement,
    });
  };

  const fetchAiGeneratedText = async () => {
    const res = await phrasingMutation.mutateAsync({
      type: "alternativePhrasing",
      text: currentText,
      excerpt: currentText,
      language: language,
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
      const [entry] = editor.nodes({ match: isRephraseElement });
      const [_node, path] = entry;
      editor.insertNode({ type: TYPE_PARAGRAPH, children: [{ text: generatedText }] }, { at: Path.next(path) });
    }
    onClose();
  };

  return (
    <DialogRoot defaultOpen closeOnInteractOutside closeOnEscape onExitComplete={onClose}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogStandaloneContent>
            <DialogHeader>
              <DialogTitle>{t("textGeneration.alternativeText")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <TextContainer>
                <Text>{currentText}</Text>
              </TextContainer>
              <Button size="small" onClick={fetchAiGeneratedText} disabled={phrasingMutation.isPending}>
                {phrasingMutation.isPending ? <Spinner size="small" /> : null}
                {t("textGeneration.generate.variant")}
                <FileListLine />
              </Button>
              <div>
                <Heading asChild consumeCss textStyle="label.medium">
                  <h2>{t("textGeneration.suggestedText")}</h2>
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
                  <Button size="small" onClick={onAppend} disabled={!generatedText}>
                    {t("textGeneration.add")}
                  </Button>
                  <Button size="small" onClick={onReplace} disabled={!generatedText}>
                    {t("textGeneration.replace")}
                  </Button>
                </HStack>
              </HStack>
            </DialogBody>
          </DialogStandaloneContent>
        </DialogPositioner>
      </Portal>
      <span {...attributes}>{children}</span>
    </DialogRoot>
  );
};
