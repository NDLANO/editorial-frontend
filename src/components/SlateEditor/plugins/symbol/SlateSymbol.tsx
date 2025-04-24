/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { Portal } from "@ark-ui/react";
import { CloseLine, DeleteBinLine } from "@ndla/icons";
import {
  Button,
  IconButton,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { isSymbolElement } from "./queries";
import { SymbolElement } from "./types";
import { InlineBugfix } from "../../utils/InlineBugFix";
import mergeLastUndos from "../../utils/mergeLastUndos";

interface Props extends RenderElementProps {
  element: SymbolElement;
  editor: Editor;
  children: ReactNode;
}

const SymbolWrapper = styled("span", {
  base: {
    backgroundColor: "surface.brand.3.moderate",
  },
  variants: {
    isSelected: {
      true: {
        outline: "1px solid",
        outlineColor: "stroke.default",
        outlineOffset: "1px",
        borderRadius: "xsmall",
      },
    },
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "surface.medium",
  },
});

const PopoverHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "medium",
  },
});

const PopoverHeaderButtons = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const SymbolButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

const StyledButton = styled(Button, {
  base: {
    width: "xxlarge",
  },
});

export const SlateSymbol = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const symbols = t("symbols", { returnObjects: true }) as Record<string, string>;
  const [open, setOpen] = useState(!!element.isFirstEdit);
  const isSelected = useSelected();

  const handleOpenChange = useCallback(
    (value: boolean, shouldDelete?: boolean) => {
      setOpen(value);
      if (!value && (shouldDelete ?? !!element.isFirstEdit)) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.removeNodes(editor, { match: isSymbolElement, at: path, voids: true });
      }
    },
    [editor, element],
  );

  const onClick = useCallback(
    (symbol: string) => {
      setOpen(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { ...element, isFirstEdit: false, symbol },
        { match: isSymbolElement, at: path, voids: true },
      );
      mergeLastUndos(editor);
      setTimeout(() => ReactEditor.focus(editor), 0);
    },
    [editor, element],
  );

  return (
    <PopoverRoot open={open} onOpenChange={(details) => handleOpenChange(details.open)} positioning={{}}>
      <PopoverTrigger asChild>
        <SymbolWrapper {...attributes} contentEditable={false} isSelected={isSelected}>
          <InlineBugfix />
          {element.symbol}
          {children}
          <InlineBugfix />
        </SymbolWrapper>
      </PopoverTrigger>
      <Portal>
        <StyledPopoverContent>
          <PopoverHeader>
            <PopoverTitle>{t("form.content.symbol.title")}</PopoverTitle>
            <PopoverHeaderButtons>
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("form.workflow.deleteComment.title")}
                title={t("form.workflow.deleteComment.title")}
                onClick={() => handleOpenChange(false, true)}
              >
                <DeleteBinLine />
              </IconButton>
              <IconButton
                variant="tertiary"
                size="small"
                aria-label={t("form.close")}
                title={t("form.close")}
                onClick={() => handleOpenChange(false)}
              >
                <CloseLine />
              </IconButton>
            </PopoverHeaderButtons>
          </PopoverHeader>
          <PopoverDescription>
            <SymbolButtonsWrapper>
              {Object.entries(symbols).map(([symbol, label]) => (
                <TooltipRoot key={symbol} openDelay={0}>
                  <TooltipTrigger asChild>
                    <StyledButton
                      variant="secondary"
                      onClick={() => onClick(symbol)}
                      aria-label={label}
                      data-testid={`button-${symbol}`}
                    >
                      {symbol}
                    </StyledButton>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </TooltipRoot>
              ))}
            </SymbolButtonsWrapper>
          </PopoverDescription>
        </StyledPopoverContent>
      </Portal>
    </PopoverRoot>
  );
};
