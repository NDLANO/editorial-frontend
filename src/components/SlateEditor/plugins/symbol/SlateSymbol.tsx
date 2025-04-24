/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useState } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { styled } from "@ndla/styled-system/jsx";
import { isSymbolElement } from "./queries";
import { SymbolPopover } from "./SymbolPopover";
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
  },
});

export const SlateSymbol = ({ element, editor, attributes, children }: Props) => {
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

  const handleSymbolClick = useCallback(
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
    <SymbolPopover open={open} handleOpenChange={handleOpenChange} handleSymbolClick={handleSymbolClick}>
      <SymbolWrapper {...attributes} contentEditable={false} isSelected={isSelected}>
        <InlineBugfix />
        {element.symbol}
        {children}
        <InlineBugfix />
      </SymbolWrapper>
    </SymbolPopover>
  );
};
