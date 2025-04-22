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
import { ReactEditor, RenderElementProps, useSlateSelector } from "slate-react";
import { DialogOpenChangeDetails, Portal, ToggleGroupValueChangeDetails } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  ToggleGroupItem,
  ToggleGroupRoot,
} from "@ndla/primitives";
import { isSymbolElement } from "./queries";
import { symbols } from "./symbols";
import { SymbolElement } from "./types";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import { InlineBugfix } from "../../utils/InlineBugFix";
import mergeLastUndos from "../../utils/mergeLastUndos";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends RenderElementProps {
  element: SymbolElement;
  editor: Editor;
  children: ReactNode;
}

type Symbol = (typeof symbols)[number];

const SymbolWrapper = styled("span", {
  variants: {
    isSelected: {
      true: {
        backgroundColor: "background.subtle",
        outline: "1px solid",
        outlineColor: "stroke.default",
        outlineOffset: "1px",
        borderRadius: "xsmall",
      },
    },
  },
});

const getCurrentSymbol = (editor: Editor) => {
  const [match] =
    Editor.nodes(editor, {
      match: isSymbolElement,
      voids: true,
    }) ?? [];

  const symbol = match?.[0];
  if (!isSymbolElement(symbol)) return;
  return symbol;
};

export const SlateSymbol = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(symbols[0]);
  const currentSymbol = useSlateSelector(getCurrentSymbol);

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

  const handleSymbolChange = useCallback(
    (details: ToggleGroupValueChangeDetails) => details.value[0] && setSelectedSymbol(details.value[0] as Symbol),
    [],
  );

  const onClick = useCallback(() => {
    setOpen(false);
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { ...element, isFirstEdit: false, symbol: selectedSymbol },
      { match: isSymbolElement, at: path, voids: true },
    );
    mergeLastUndos(editor);
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element, selectedSymbol]);

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <SymbolWrapper {...attributes} contentEditable={false} isSelected={!!currentSymbol}>
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
            <ToggleGroupRoot value={[selectedSymbol]} onValueChange={handleSymbolChange}>
              {symbols.map((symbol) => (
                <ToggleGroupItem key={symbol} value={symbol} asChild>
                  <Button variant="tertiary">{symbol}</Button>
                </ToggleGroupItem>
              ))}
            </ToggleGroupRoot>
            <FormActionsContainer>
              <Button onClick={onClick}>{t("form.content.symbol.insert")}</Button>
            </FormActionsContainer>
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
