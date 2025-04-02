/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Node, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { FileListLine } from "@ndla/icons";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Heading,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { useGenerateAlternativePhrasingMutation } from "../../../../modules/llm/llmMutations";
import { NdlaErrorPayload } from "../../../../util/resolveJsonOrRejectWithError";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { isRephraseElement } from "./queries/rephraseQueries";
import { RephraseElement } from "./rephraseTypes";
import { useToast } from "../../../ToastProvider";

interface Props extends RenderElementProps {
  element: RephraseElement;
  editor: Editor;
}

const StyledText = styled(Text, {
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
  const phrasingMutation = useGenerateAlternativePhrasingMutation();
  const toast = useToast();

  // TODO Handle marks and inlines in query.
  const currentText = useMemo(() => Node.string(element), [element]);

  const onClose = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      match: isRephraseElement,
      at: path,
    });
  };

  const fetchAiGeneratedText = async () =>
    await phrasingMutation
      .mutateAsync({
        type: "alternativePhrasing",
        text: currentText,
        excerpt: currentText,
        language: language,
      })
      .then((res) => setGeneratedText(res))
      .catch((err: NdlaErrorPayload) =>
        toast.error({ title: t("textGeneration.failed.variant"), description: err.messages, removeDelay: 1500 }),
      );

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
      editor.insertNode({ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: generatedText }] }, { at: Path.next(path) });
    }
    onClose();
  };

  return (
    <DialogRoot defaultOpen onExitComplete={onClose}>
      <Portal>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("textGeneration.alternativeText")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <StyledText>{currentText}</StyledText>
            <Button size="small" onClick={fetchAiGeneratedText} loading={phrasingMutation.isPending}>
              {t("textGeneration.generate.variant")}
              <FileListLine />
            </Button>
            <Heading asChild consumeCss textStyle="label.medium">
              <h2>{t("textGeneration.suggestedText")}</h2>
            </Heading>
            <StyledText>{generatedText}</StyledText>
            <HStack justify="space-between">
              <DialogCloseTrigger asChild>
                <Button size="small" variant="secondary">
                  {t("dialog.close")}
                </Button>
              </DialogCloseTrigger>
              <FormActionsContainer>
                <Button size="small" onClick={onAppend} disabled={!generatedText}>
                  {t("textGeneration.add")}
                </Button>
                <Button size="small" onClick={onReplace} disabled={!generatedText}>
                  {t("textGeneration.replace")}
                </Button>
              </FormActionsContainer>
            </HStack>
          </DialogBody>
        </DialogContent>
      </Portal>
      <span {...attributes}>{children}</span>
    </DialogRoot>
  );
};
