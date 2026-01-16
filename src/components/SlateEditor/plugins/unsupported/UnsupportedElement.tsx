/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { ArrowLeftShortLine, DeleteBinLine, InformationLine } from "@ndla/icons";
import {
  IconButton,
  MessageBox,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  Text as TextPrimitive,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { UNSUPPORTED_ELEMENT_TYPE } from "./types";
import { FormActionsContainer } from "../../../FormikForm";
import { InlineBugfix } from "../../utils/InlineBugFix";

interface Props extends RenderElementProps {
  editor: Editor;
}

const StyledMessageBox = styled(MessageBox, {
  base: {
    position: "relative",
    marginBlock: "xxlarge",
    width: "100%",
  },
});

const StyledPopoverTrigger = styled(PopoverTrigger, {
  base: {
    background: "surface.dangerSubtle",
    border: "1px solid",
    borderRadius: "xsmall",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledDiv = styled("div", {
  base: {
    position: "absolute",
    top: "-xlarge",
    left: "0",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    gap: "xsmall",
  },
});

const ContentWrapper = styled("div", {
  base: {
    width: "inherit",
  },
});

export const UnsupportedElement = ({ editor, attributes, element, children }: Props) => {
  const { t } = useTranslation();

  const isVoid = useMemo(() => editor.isVoid(element), [editor, element]);

  const originalElementType = useMemo(() => {
    if (element.type === UNSUPPORTED_ELEMENT_TYPE) {
      return element.data.originalElement.type;
    }
    return element.type;
  }, [element]);

  const isInline = useMemo(() => {
    if (editor.isInline(element)) return true;
    const path = ReactEditor.findPath(editor, element);
    const [parent] = editor.parent(path);
    return Node.isElement(parent) && (editor.isInline(parent) || parent.type === PARAGRAPH_ELEMENT_TYPE);
  }, [editor, element]);

  const onLiftContent = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    if (element.children.every((child) => Node.isText(child) || editor.isInline(child))) {
      Transforms.setNodes(editor, { type: PARAGRAPH_ELEMENT_TYPE }, { at: path });
    } else {
      Transforms.unwrapNodes(editor, { at: path, voids: true });
    }
  }, [editor, element]);

  const onRemoveElement = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
  }, [editor, element]);

  if (isInline) {
    return (
      <PopoverRoot>
        <StyledPopoverTrigger asChild consumeCss {...attributes}>
          <span>
            <InlineBugfix />
            {children}
            <InlineBugfix />
          </span>
        </StyledPopoverTrigger>
        <Portal>
          <StyledPopoverContent asChild>
            <MessageBox variant="error">
              <PopoverTitle>{t("unsupportedElement.title", { type: originalElementType })}</PopoverTitle>
              <PopoverDescription>{t("unsupportedElement.description")}</PopoverDescription>
              <FormActionsContainer>
                {!isVoid && (
                  <IconButton
                    variant="secondary"
                    size="small"
                    onClick={onLiftContent}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ArrowLeftShortLine />
                  </IconButton>
                )}
                <IconButton variant="danger" size="small" onClick={onRemoveElement}>
                  <DeleteBinLine />
                </IconButton>
              </FormActionsContainer>
            </MessageBox>
          </StyledPopoverContent>
        </Portal>
      </PopoverRoot>
    );
  }

  return (
    <StyledMessageBox data-embed-wrapper="" variant="error">
      <StyledDiv contentEditable={false}>
        <TextPrimitive textStyle="title.small" contentEditable={false}>
          {t("unsupportedElement.title", { type: originalElementType })}
        </TextPrimitive>
        <FormActionsContainer>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <IconButton variant="secondary" size="small">
                <InformationLine />
              </IconButton>
            </PopoverTrigger>
            <Portal>
              <StyledPopoverContent>
                <PopoverTitle>{t("unsupportedElement.title", { type: originalElementType })}</PopoverTitle>
                <PopoverDescription>{t("unsupportedElement.description")}</PopoverDescription>
              </StyledPopoverContent>
            </Portal>
          </PopoverRoot>
          {!isVoid && (
            <IconButton
              variant="secondary"
              size="small"
              onClick={onLiftContent}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ArrowLeftShortLine />
            </IconButton>
          )}
          <IconButton variant="danger" size="small" onClick={onRemoveElement} onMouseDown={(e) => e.preventDefault()}>
            <DeleteBinLine />
          </IconButton>
        </FormActionsContainer>
      </StyledDiv>
      <ContentWrapper {...attributes} contentEditable={isVoid ? false : undefined}>
        {editor.isVoid(element) && <div>{t("unsupportedElement.noContent")}</div>}
        {children}
      </ContentWrapper>
    </StyledMessageBox>
  );
};
