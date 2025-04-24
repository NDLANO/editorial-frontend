/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { isSymbolElement } from "./queries";
import { SymbolElement } from "./types";
import { DialogCloseButton } from "../../../DialogCloseButton";
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

const SymbolButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

export const SlateSymbol = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const symbols = t("symbols", { returnObjects: true }) as Record<string, string>;
  const [open, setOpen] = useState(false);
  const isSelected = useSelected();

  useEffect(() => {
    setOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const handleOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      setOpen(details.open);
      if (!details.open) {
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
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <SymbolWrapper {...attributes} contentEditable={false} isSelected={isSelected}>
        <InlineBugfix />
        {element.symbol}
        {children}
        <InlineBugfix />
      </SymbolWrapper>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.content.symbol.title")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <SymbolButtonsWrapper>
              {Object.entries(symbols).map(([symbol, label]) => (
                <TooltipRoot key={symbol} openDelay={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => onClick(symbol)}
                      aria-label={label}
                      data-testid={`button-${symbol}`}
                    >
                      {symbol}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </TooltipRoot>
              ))}
            </SymbolButtonsWrapper>
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
