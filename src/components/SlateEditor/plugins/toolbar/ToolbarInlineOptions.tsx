/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { Editor, Element } from "slate";
import { useSlate, useSlateSelector } from "slate-react";
import { ToggleItem } from "@radix-ui/react-toolbar";
import { StyledToggleGroup, ToolbarCategoryProps } from "./SlateToolbar";
import ToolbarButton from "./ToolbarButton";
import { InlineType } from "./toolbarState";
import { insertComment } from "../comment/inline/utils";
import { insertInlineConcept } from "../concept/inline/utils";
import { insertLink } from "../link/utils";
import { insertMathml } from "../mathml/utils";

const getCurrentInlineValues = (editor: Editor): InlineType | undefined => {
  const [currentBlock] =
    Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n.type === "concept-inline" ||
          n.type === "content-link" ||
          n.type === "mathml" ||
          n.type === "comment-inline"),
      mode: "lowest",
    }) ?? [];

  const node = currentBlock?.[0];
  if (!Element.isElement(node)) return;
  return node.type as InlineType;
};

export const ToolbarInlineOptions = ({ options }: ToolbarCategoryProps<InlineType>) => {
  const editor = useSlate();
  const value = useSlateSelector(getCurrentInlineValues);

  const onClick = useCallback(
    (type: InlineType) => {
      if (type === "content-link") {
        insertLink(editor);
      }
      if (type === "mathml") {
        insertMathml(editor);
      }
      if (type === "concept-inline") {
        insertInlineConcept(editor, "concept");
      }
      if (type === "gloss-inline") {
        insertInlineConcept(editor, "gloss");
      }
      if (type === "comment-inline") {
        insertComment(editor);
      }
    },
    [editor],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <StyledToggleGroup type="single" value={value ?? ""}>
      {visibleOptions.map((type) => (
        <ToggleItem key={type.value} value={type.value} asChild disabled={type.disabled}>
          <ToolbarButton type={type.value} onClick={() => onClick(type.value)} disabled={type.disabled} />
        </ToggleItem>
      ))}
    </StyledToggleGroup>
  );
};
