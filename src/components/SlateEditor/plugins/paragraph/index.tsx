/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Element, Descendant, Text, Path, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_PARAGRAPH } from "./types";
import { isParagraph } from "./utils";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import containsVoid from "../../utils/containsVoid";
import { KEY_ENTER } from "../../utils/keys";
import { TYPE_BREAK } from "../break/types";
import { TYPE_SUMMARY } from "../details/types";
import { TYPE_LIST_ITEM } from "../list/types";
import { TYPE_NOOP } from "../noop/types";
import { TYPE_TABLE_CELL } from "../table/types";

export interface ParagraphElement {
  type: "paragraph";
  data?: {
    align?: string;
  };
  serializeAsText?: boolean;
  children: Descendant[];
}

const onEnter = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (!editor.selection) return nextOnKeyDown?.(e);
  const [entry] = Editor.nodes<ParagraphElement>(editor, {
    match: (node) => isParagraph(node) && !editor.isInline(node),
    mode: "lowest",
  });

  if (!entry) {
    return nextOnKeyDown?.(e);
  }
  e.preventDefault();

  const [currentParagraph, currentParagraphPath] = entry;
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  if (Node.string(currentParagraph) === "" && !containsVoid(editor, currentParagraph)) {
    editor.insertNode({
      type: TYPE_BREAK,
      children: [{ text: "" }],
    });

    editor.insertNode({
      type: TYPE_PARAGRAPH,
      children: [{ text: "" }],
    });
    return;
  }

  if (e.shiftKey === true) {
    return editor.insertText("\n");
  }

  if (
    editor.selection &&
    !Editor.isEnd(editor, editor.selection.anchor, currentParagraphPath) &&
    !Editor.isStart(editor, editor.selection.anchor, currentParagraphPath)
  ) {
    return Transforms.splitNodes(editor, { match: (node) => isParagraph(node), at: editor.selection });
  }

  if (Editor.isStart(editor, editor.selection.anchor, currentParagraphPath)) {
    return Transforms.insertNodes(
      editor,
      {
        type: TYPE_PARAGRAPH,
        children: [{ text: "" }],
      },
      { at: editor.selection },
    );
  }

  return Transforms.insertNodes(editor, {
    type: TYPE_PARAGRAPH,
    children: [{ text: "" }],
  });
};

export const paragraphSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "p") return;

    const data = parseElementAttributes(Array.from(el.attributes), ["align", "data-align"]);

    return slatejsx(
      "element",
      {
        type: TYPE_PARAGRAPH,
        ...(Object.keys(data).length > 0 ? { data } : {}),
      },
      children,
    );
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_PARAGRAPH) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    if (Node.string(node) === "" && node.children.length === 1 && Text.isText(node.children[0])) return undefined;

    if (node.serializeAsText) {
      return children;
    }

    const data = createDataAttributes({ align: node.data?.align });
    return createHtmlTag({ tag: "p", data, children });
  },
};

export const paragraphPlugin = (editor: Editor) => {
  const { onKeyDown, normalizeNode } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, onKeyDown);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_PARAGRAPH) {
      const [parentNode] = Editor.node(editor, Path.parent(path));

      // If paragraph is not in a list or table, make sure it will be rendered with <p>-tag
      if (
        Element.isElement(parentNode) &&
        parentNode.type !== TYPE_TABLE_CELL &&
        parentNode.type !== TYPE_LIST_ITEM &&
        parentNode.type !== TYPE_SUMMARY &&
        parentNode.type !== TYPE_NOOP &&
        node.serializeAsText
      ) {
        return Transforms.unsetNodes(editor, "serializeAsText", { at: path });
      }

      // If two paragraphs are direct siblings, make sure both will be rendered with <p>-tag
      if (Path.hasPrevious(path)) {
        const [previousNode] = Editor.node(editor, Path.previous(path));
        if (isParagraph(previousNode) && (previousNode.serializeAsText || node.serializeAsText)) {
          return Transforms.unsetNodes(editor, "serializeAsText", {
            at: Path.parent(path),
            mode: "all",
            match: isParagraph,
          });
        }
      }
      if (Editor.hasPath(editor, Path.next(path))) {
        const [nextNode] = Editor.node(editor, Path.next(path));
        if (isParagraph(nextNode) && (nextNode.serializeAsText || node.serializeAsText)) {
          return Transforms.unsetNodes(editor, "serializeAsText", {
            at: Path.parent(path),
            mode: "all",
            match: isParagraph,
          });
        }
      }

      // Unwrap block element children. Only text allowed.
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
