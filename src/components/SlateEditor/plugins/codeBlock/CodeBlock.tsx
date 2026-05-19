/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { DeleteBinLine, PencilFill, CodeView } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Figure,
  IconButton,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { CodeEmbedData } from "@ndla/types-embed";
import { CodeBlock as UICodeBlock } from "@ndla/ui";
import he from "he";
import * as Prism from "prismjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { CodeBlockType } from "../../../../interfaces";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import { useEditableElement } from "../../utils/useEditableElement";
import CodeBlockEditor from "./CodeBlockEditor";
import { CodeBlockElement } from "./types";

interface Props extends RenderElementProps {
  element: CodeBlockElement;
  editor: Editor;
}

const StyledFigure = styled(Figure, {
  base: {
    clear: "both",
  },
});

let languagesPromise: Promise<unknown> | undefined;

const loadLanguages = async () => {
  // Prism language files are side-effect modules that mutate the shared Prism instance.
  // We lazy-load one local module with static imports so Vite 7/8 can rewrite specifiers
  // reliably. Variable specifiers (e.g. import(path)) can leak unresolved bare imports.
  languagesPromise ??= import("./prismLanguages");
  await languagesPromise;
};

const highlightCode = (code: string, language: string): string => {
  const highlighted = Prism.highlight(code, Prism.languages[language], language);
  return highlighted;
};

const getInfoFromNode = (data: CodeEmbedData): CodeEmbedData => {
  return {
    resource: "code-block",
    codeContent: he.decode(data.codeContent || "") as string,
    title: data.title || "",
    codeFormat: data.codeFormat || "text",
  };
};

const CodeBlock = ({ attributes, editor, element, children }: Props) => {
  const embedData = useMemo(() => getInfoFromNode(element.data), [element.data]);
  const [languagesLoaded, setLanguagesLoaded] = useState(false);
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const { t } = useTranslation();
  const { handleSave, handleRemove, handleEditingChange, isBlocked, confirmClose, cancelClose, dialogProps } =
    useEditableElement(element, editor);

  useEffect(() => {
    loadLanguages().then(() => setLanguagesLoaded(true));
  }, []);

  const highlightedCode = useMemo(() => {
    if (!embedData.codeFormat?.length || !embedData.codeContent?.length || !languagesLoaded) {
      return embedData.codeContent;
    }

    return highlightCode(embedData.codeContent, embedData.codeFormat);
  }, [embedData.codeContent, embedData.codeFormat, languagesLoaded]);

  const onSave = (codeBlock: CodeBlockType) => {
    handleSave({
      data: {
        resource: "code-block",
        codeFormat: codeBlock.format,
        title: codeBlock.title,
        codeContent: he.encode(codeBlock.code),
      },
    });
  };

  return (
    <>
      <DialogRoot
        {...dialogProps}
        onOpenChange={(details) => handleEditingChange(details.open, shouldShowWarning)}
        size="large"
      >
        <StyledFigure aria-label={t("codeEditor.subtitle")} contentEditable={false} {...attributes}>
          <HStack justify="space-between">
            {!!embedData.title && <h3>{embedData.title}</h3>}
            <HStack gap="4xsmall">
              <DialogTrigger asChild>
                <IconButton
                  size="small"
                  variant="secondary"
                  title={t("codeEditor.edit")}
                  aria-label={t("codeEditor.edit")}
                >
                  <PencilFill />
                </IconButton>
              </DialogTrigger>
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("codeEditor.remove")}
                data-testid="remove-code"
                onClick={handleRemove}
              >
                <DeleteBinLine />
              </IconButton>
            </HStack>
          </HStack>
          <UICodeBlock format={embedData.codeFormat} highlightedCode={highlightedCode} />
          {children}
        </StyledFigure>
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("codeEditor.title")} <CodeView />
              </DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <CodeBlockEditor
                content={{
                  code: embedData.codeContent,
                  format: embedData.codeFormat,
                  title: embedData.title || "",
                }}
                onSave={onSave}
                highlight={highlightCode}
                onAbort={() => handleEditingChange(false, shouldShowWarning)}
                setShowWarning={setShouldShowWarning}
              />
            </DialogBody>
          </DialogContent>
        </Portal>
      </DialogRoot>
      <AlertDialog
        title={t("unsavedChanges")}
        label={t("unsavedChanges")}
        show={isBlocked}
        text={t("code.continue")}
        onCancel={cancelClose}
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={cancelClose}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={confirmClose}>
            {t("alertDialog.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default CodeBlock;
