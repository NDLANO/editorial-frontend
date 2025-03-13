/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { ToolbarCategoryProps } from "./SlateToolbar";
import { InlineType } from "./toolbarState";
import { ToolbarToggleButton, ToolbarToggleGroupRoot } from "./ToolbarToggle";
import { insertComment } from "../comment/inline/utils";
import { insertInlineConcept } from "../concept/inline/utils";
import { insertLink } from "../link/utils";
import { insertMathml } from "../mathml/utils";
import { wrapRephrase } from "../rephrase/utils";

const getCurrentInlineValues = (editor: Editor): InlineType | undefined => {
  const [currentBlock] =
    Editor.nodes(editor, {
      match: (n) =>
        Element.isElement(n) &&
        (n.type === "concept-inline" ||
          n.type === "content-link" ||
          n.type === "mathml" ||
          n.type === "comment-inline" ||
          n.type === "rephrase"),
      mode: "lowest",
    }) ?? [];

  const node = currentBlock?.[0];
  if (!Element.isElement(node)) return;
  return node.type as InlineType;
};

export const ToolbarInlineOptions = ({ options }: ToolbarCategoryProps<InlineType>) => {
  const editor = useSlate();
  const value = useSlateSelector(getCurrentInlineValues);
  const selection = useSlateSelection();

  const onClick = useCallback(
    (type: InlineType) => {
      if (!selection) return;
      Transforms.select(editor, selection);
      ReactEditor.focus(editor);
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
      if (type === "rephrase") {
        wrapRephrase(editor);
      }
    },
    [editor, selection],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <ToolbarToggleGroupRoot value={value ? [value] : []}>
      {visibleOptions.map((type) => (
        <ToolbarToggleButton
          type={type.value}
          onClick={(e) => {
            e.preventDefault();
            onClick(type.value);
          }}
          onMouseDown={(e) => e.preventDefault()}
          disabled={type.disabled}
          key={type.value}
          value={type.value}
        />
      ))}
    </ToolbarToggleGroupRoot>
  );
};
