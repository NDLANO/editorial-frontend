/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect } from "react";
import { ReactEditor, RenderElementProps, useSelected, useSlate } from "slate-react";
import { styled } from "@ndla/styled-system/jsx";
import { useMathDialog } from "./FloathingMathDialog";
import { useFloatingMathPopover } from "./FloatingMathPopover";
import MathML from "./MathML";
import { MathmlElement } from "./mathTypes";

const StyledSpan = styled("span", {
  base: {
    display: "inline-block",
    _selected: {
      outline: "1px solid",
      outlineColor: "stroke.default",
      outlineOffset: "4xsmall",
      borderRadius: "xsmall",
    },
  },
});

interface Props extends RenderElementProps {
  element: MathmlElement;
}

export const MathEditor = ({ element, children, attributes }: Props) => {
  const editor = useSlate();
  const { togglePopover } = useFloatingMathPopover();
  const { toggleDialog } = useMathDialog();

  useEffect(() => {
    toggleDialog(!!element.isFirstEdit, element);
  }, [element, toggleDialog]);

  const isSelected = useSelected();

  const onClick = useCallback(() => {
    togglePopover(true, [element, ReactEditor.findPath(editor, element)]);
  }, [editor, element, togglePopover]);

  return (
    <StyledSpan
      role="button"
      {...attributes}
      contentEditable={false}
      tabIndex={0}
      data-selected={isSelected ? "" : undefined}
      onClick={onClick}
    >
      <MathML element={element} />
      {children}
    </StyledSpan>
  );
};
