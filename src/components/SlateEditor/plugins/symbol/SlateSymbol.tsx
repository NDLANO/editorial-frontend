/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { CloseLine, DeleteBinLine } from "@ndla/icons";
import {
  Button,
  IconButton,
  MessageBox,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  Text,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { InlineBugfix } from "../../utils/InlineBugFix";
import mergeLastUndos from "../../utils/mergeLastUndos";
import { symbols } from "./constants";
import { isSymbolElement } from "./queries";
import { SymbolData, SymbolElement } from "./types";

interface Props extends RenderElementProps {
  element: SymbolElement;
  editor: Editor;
  children: ReactNode;
}

const SymbolWrapper = styled("span", {
  base: {
    backgroundColor: "surface.brand.3.moderate",
    cursor: "pointer",
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
    isUnknown: {
      true: {
        backgroundColor: "surface.error",
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

const StyledPopoverDescription = styled(PopoverDescription, {
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
  const [open, setOpen] = useState(false);
  const isSelected = useSelected();
  const { t } = useTranslation();

  const symbolTooltip = element.symbol ? t(`symbols.${element.symbol.name}`) : undefined;
  const isUnknownSymbol = element.symbol?.name === "unknown";

  useEffect(() => {
    if (element.isFirstEdit) {
      setOpen(true);
      const path = ReactEditor.findPath(editor, element);
      Transforms.select(editor, { path: Path.next(path), offset: 0 });
    }
  }, [editor, element]);

  const handleOpenChange = useCallback(
    (value: boolean, shouldDelete?: boolean) => {
      setOpen(value);
      if (!value) {
        if (shouldDelete ?? !!element.isFirstEdit) {
          const path = ReactEditor.findPath(editor, element);
          Transforms.removeNodes(editor, { match: isSymbolElement, at: path, voids: true });
        }

        ReactEditor.focus(editor);
      }
    },
    [editor, element],
  );

  const handleSymbolClick = useCallback(
    (symbolData: SymbolData) => {
      setOpen(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { ...element, isFirstEdit: false, symbol: symbolData },
        { match: isSymbolElement, at: path, voids: true },
      );
      mergeLastUndos(editor);
      setTimeout(() => ReactEditor.focus(editor), 0);
    },
    [editor, element],
  );

  return (
    <PopoverRoot open={open} onOpenChange={(details) => handleOpenChange(details.open)}>
      <PopoverTrigger asChild type={undefined}>
        <SymbolWrapper
          {...attributes}
          contentEditable={false}
          title={symbolTooltip}
          isSelected={isSelected}
          isUnknown={isUnknownSymbol}
        >
          <InlineBugfix />
          {element.symbol?.icon ?? element.symbol?.text}
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
          <StyledPopoverDescription>
            {isUnknownSymbol ? (
              <MessageBox variant="error">
                <Text>{t("form.content.symbol.unknown")}</Text>
              </MessageBox>
            ) : null}
            {symbols.map((symbol) => {
              const label = t(`symbols.${symbol.name}`);
              const isSelectedSymbol = element.symbol?.name === symbol.name;

              return (
                <TooltipRoot key={symbol.name} openDelay={0}>
                  <TooltipTrigger asChild>
                    <StyledButton
                      variant="secondary"
                      onClick={() => handleSymbolClick(symbol)}
                      aria-label={label}
                      data-state={isSelectedSymbol ? "on" : undefined}
                      data-testid={`button-${symbol.name}`}
                    >
                      {symbol.icon ?? symbol.text}
                    </StyledButton>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </TooltipRoot>
              );
            })}
          </StyledPopoverDescription>
        </StyledPopoverContent>
      </Portal>
    </PopoverRoot>
  );
};
