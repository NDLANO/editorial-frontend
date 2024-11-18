/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SyntheticEvent } from "react";
import { Editor, Transforms, Element, Range, Path, Node, BaseRange } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { BlockType, InlineType, TextType, getEditorAncestors } from "./toolbarState";
import toggleBlock from "../../utils/toggleBlock";
import { insertComment } from "../comment/inline/utils";
import { insertInlineConcept } from "../concept/inline/utils";
import { toggleDefinitionList } from "../definitionList/utils/toggleDefinitionList";
import { HeadingElement } from "../heading";
import { TYPE_HEADING } from "../heading/types";
import { toggleHeading } from "../heading/utils";
import { insertLink, unwrapLink } from "../link/utils";
import { LIST_TYPES } from "../list/types";
import { toggleList } from "../list/utils/toggleList";
import { insertMathml } from "../mathml/utils";
import { ParagraphElement } from "../paragraph";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { SpanElement } from "../span";
import { TYPE_SPAN } from "../span/types";
import { toggleCellAlign } from "../table/slateActions";

type TextElements = ParagraphElement | HeadingElement | SpanElement;
const defaultValueState: Partial<Record<Element["type"], Partial<TextElements>>> = {
  summary: { type: TYPE_PARAGRAPH, serializeAsText: true },
};

const parseHeadingLevel = (type: string) => parseInt(type.replace("heading-", "")) as 1 | 2 | 3 | 4 | 5 | 6;

const textOptions = (range: BaseRange) => ({
  at: range,
  match: (node: Node) => Element.isElement(node) && (node.type === "heading" || node.type === "paragraph"),
});

export const handleTextChange = (editor: Editor, type: string) => {
  const ancestors = getEditorAncestors(editor, true);
  const defaultValue = defaultValueState?.[ancestors[1]?.type] ??
    defaultValueState?.[ancestors[0]?.type] ?? { type: TYPE_PARAGRAPH };

  const props: Partial<TextElements> =
    type === "normal-text" ? defaultValue : { type: TYPE_HEADING, level: parseHeadingLevel(type) };

  Editor.withoutNormalizing(editor, () => {
    if (!Range.isRange(editor.selection)) {
      return;
    }

    const selectionPath = Editor.unhangRange(editor, editor.selection);
    const options = textOptions(selectionPath);

    if (props.type === TYPE_SPAN) {
      return Transforms.unwrapNodes(editor, options);
    }

    // Find the current node in use
    const [node] = Editor.nodes(editor, options);
    if (node) {
      if (props.type === TYPE_HEADING && props.level === 2) unwrapLink(editor);
      Transforms.setNodes(editor, props, options);
    } else {
      // If there is no heading or paragraph nodes its a filtered span node
      const [textNode, textPath] = Editor.node(editor, selectionPath);
      Transforms.wrapNodes(editor, slatejsx("element", props, textNode), {
        at: textPath,
      });
    }
  });
};

export function handleClickBlock(event: Event, editor: Editor, type: BlockType) {
  event.preventDefault();
  if (type === "quote") {
    toggleBlock(editor, type);
  } else if (LIST_TYPES.includes(type)) {
    toggleList(editor, type);
  } else if (type === "definition-list") {
    toggleDefinitionList(editor);
  }
}

export const handleClickText = (event: Event, editor: Editor, type: TextType) => {
  event.preventDefault();
  if (type === "heading-4") {
    toggleHeading(editor, 4);
  } else if (type === "heading-3") {
    toggleHeading(editor, 3);
  } else if (type === "heading-2") {
    toggleHeading(editor, 2);
  }
};

export function handleClickInline(event: Event, editor: Editor, type: InlineType) {
  if (editor.selection) {
    event.preventDefault();
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
  }
}

export const handleClickTable = (event: SyntheticEvent, editor: Editor, type: string) => {
  event.preventDefault();

  if (["left", "center", "right"].includes(type)) {
    toggleCellAlign(editor, type);
  }
};
