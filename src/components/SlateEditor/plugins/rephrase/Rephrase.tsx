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
import { isRephrase, unwrapRephrase } from "./utils";
import { useGenerateAlternativePhrasing } from "../../../../util/llmUtils";
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
  const { mutateAsync, isPending } = useGenerateAlternativePhrasing();

  const currentText = element.children.find(SlateText.isText)?.text ?? "";

  const onClose = () => {
    unwrapRephrase(editor);
  };

  const fetchAiGeneratedText = async () => {
    const res = await mutateAsync({
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
      const [entry] = editor.nodes({ match: isRephrase });
      const [_node, path] = entry;
      editor.insertNode({ type: TYPE_PARAGRAPH, children: [{ text: generatedText }] }, { at: Path.next(path) });
    }
    onClose();
  };

  return (
    <DialogRoot defaultOpen closeOnInteractOutside closeOnEscape onExitComplete={onClose}>
      <Portal>
        <StyledDialogBackdrop />
        <StyledDialogPositioner>
          <DialogStandaloneContent>
            <DialogHeader>
              <DialogTitle>{t("textGeneration.alternativeText")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <TextContainer>
                <Text>{currentText}</Text>
              </TextContainer>
              <Button size="small" onClick={fetchAiGeneratedText} disabled={isPending}>
                {isPending ? <Spinner size="small" /> : null}
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
        </StyledDialogPositioner>
      </Portal>
      <span {...attributes}>{children}</span>
    </DialogRoot>
  );
};
