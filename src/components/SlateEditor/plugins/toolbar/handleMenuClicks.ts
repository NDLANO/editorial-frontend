/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, SyntheticEvent } from "react";
import { Editor, Transforms, Element, Range, Node, BaseRange } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  HEADING_ELEMENT_TYPE,
  HeadingElement,
  LIST_TYPES,
  PARAGRAPH_ELEMENT_TYPE,
  ParagraphElement,
  toggleHeading,
  toggleList,
} from "@ndla/editor";
import { BlockType, InlineType, TextType } from "./toolbarState";
import toggleBlock from "../../utils/toggleBlock";
import { insertComment } from "../comment/inline/utils";
import { insertInlineConcept } from "../concept/inline/utils";
import { insertLink, unwrapLink } from "../link/utils";
import { insertMathml } from "../mathml/utils";
import { SpanElement } from "../span";
import { SPAN_ELEMENT_TYPE } from "../span/types";
import { toggleCellAlign } from "../table/slateActions";
import { insertSymbol } from "../symbol/utils";
import { SYMBOL_ELEMENT_TYPE } from "../symbol/types";
import { toggleDefinitionList } from "../definitionList/transforms/toggleDefinitionList";
import { ElementType } from "../../interfaces";

type TextElements = ParagraphElement | HeadingElement | SpanElement;
const defaultValueState: Partial<Record<ElementType, Partial<TextElements>>> = {
  summary: { type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true },
};

const parseHeadingLevel = (type: string) => parseInt(type.replace("heading-", "")) as 1 | 2 | 3 | 4 | 5 | 6;

const textOptions = (range: BaseRange) => ({
  at: range,
  match: (node: Node) => Element.isElement(node) && (node.type === "heading" || node.type === "paragraph"),
});

export const handleTextChange = (editor: Editor, type: string) => {
  const { elements } = editor.selectionElements;
  const defaultValue = (elements?.[0] && defaultValueState[elements[0].type]) ?? { type: PARAGRAPH_ELEMENT_TYPE };

  const props: Partial<TextElements> =
    type === "normal-text" ? defaultValue : { type: HEADING_ELEMENT_TYPE, level: parseHeadingLevel(type) };

  Editor.withoutNormalizing(editor, () => {
    if (!Range.isRange(editor.selection)) {
      return;
    }

    const selectionPath = Editor.unhangRange(editor, editor.selection);
    const options = textOptions(selectionPath);

    if (props.type === SPAN_ELEMENT_TYPE) {
      return Transforms.unwrapNodes(editor, options);
    }

    // Find the current node in use
    const [node] = Editor.nodes(editor, options);
    if (node) {
      if (props.type === HEADING_ELEMENT_TYPE && props.level === 2) unwrapLink(editor);
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

export function handleClickBlock(event: KeyboardEvent<HTMLDivElement>, editor: Editor, type: BlockType) {
  event.preventDefault();
  if (type === "quote") {
    toggleBlock(editor, type);
  } else if (type === "definition-list") {
    toggleDefinitionList(editor);
  } else if (LIST_TYPES.includes(type)) {
    toggleList(editor, type);
  }
}

export const handleClickText = (event: KeyboardEvent<HTMLDivElement>, editor: Editor, type: TextType) => {
  event.preventDefault();
  if (type === "heading-4") {
    toggleHeading(editor, 4);
  } else if (type === "heading-3") {
    toggleHeading(editor, 3);
  } else if (type === "heading-2") {
    toggleHeading(editor, 2);
  }
};

export function handleClickInline(event: KeyboardEvent<HTMLDivElement>, editor: Editor, type: InlineType) {
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
    if (type === SYMBOL_ELEMENT_TYPE) {
      insertSymbol(editor);
    }
  }
}

export const handleClickTable = (event: SyntheticEvent, editor: Editor, type: string) => {
  event.preventDefault();

  if (["left", "center", "right"].includes(type)) {
    toggleCellAlign(editor, type);
  }
};
