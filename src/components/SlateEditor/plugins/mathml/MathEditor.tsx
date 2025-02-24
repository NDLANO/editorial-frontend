/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { ReactEditor, RenderElementProps, useSelected, useSlate } from "slate-react";
import { InlineBugfix } from "@ndla/editor-components";
import { styled } from "@ndla/styled-system/jsx";
import { useMathDialog } from "./FloathingMathDialog";
import { useFloatingMathPopover } from "./FloatingMathPopover";
import MathML from "./MathML";
import { MathmlElement } from "./mathTypes";
import { getInfoFromNode } from "./utils";

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

  const nodeInfo = useMemo(() => getInfoFromNode(element), [element]);

  return (
    <StyledSpan
      role="button"
      {...attributes}
      contentEditable={false}
      tabIndex={0}
      data-selected={isSelected ? "" : undefined}
      onClick={() => togglePopover(true, [element, ReactEditor.findPath(editor, element)])}
    >
      <MathML model={nodeInfo.model} editor={editor} element={element} />
      <InlineBugfix />
      {children}
      <InlineBugfix />
    </StyledSpan>
  );
};
