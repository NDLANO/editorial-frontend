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
import { getCurrentParagraph, isParagraph } from "./utils";
import { reduceElementDataAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import containsVoid from "../../utils/containsVoid";
import { KEY_ENTER } from "../../utils/keys";
import { TYPE_BREAK } from "../break/types";
import { TYPE_LIST_ITEM } from "../list/types";
import { TYPE_NOOP } from "../noop/types";
import { createPlugin, createPluginFactory } from "../PluginFactory";
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
  const currentParagraph = getCurrentParagraph(editor);

  if (!currentParagraph) {
    return nextOnKeyDown?.(e);
  }
  e.preventDefault();
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

  return editor.insertNode({
    type: TYPE_PARAGRAPH,
    children: [{ text: "" }],
  });
};

export const paragraphSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "p") return;

    const data = reduceElementDataAttributes(el, ["align", "data-align"]);

    return slatejsx(
      "element",
      {
        type: TYPE_PARAGRAPH,
        ...(Object.keys(data).length > 0 ? { data } : {}),
      },
      children,
    );
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_PARAGRAPH) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    if (Node.string(node) === "" && node.children.length === 1 && Text.isText(node.children[0])) return null;

    if (node.serializeAsText) {
      return <>{children}</>;
    }

    const attributes = node.data?.align ? { "data-align": node.data.align } : {};
    return <p {...attributes}>{children}</p>;
  },
};

export const paragraphPlugin = createPlugin<ParagraphElement["type"]>({
  type: TYPE_PARAGRAPH,
  onKeyDown: {
    [KEY_ENTER]: onEnter,
  },
  normalize: [
    {
      description: "Pargraph should be rendered as plaintext",
      normalize: ([node, path], editor) => {
        const [parentNode] = Editor.node(editor, Path.parent(path));
        if (
          Element.isElement(parentNode) &&
          parentNode.type !== TYPE_TABLE_CELL &&
          parentNode.type !== TYPE_LIST_ITEM &&
          parentNode.type !== TYPE_NOOP &&
          node.serializeAsText
        ) {
          Transforms.unsetNodes(editor, "serializeAsText", { at: path });
          return true;
        }
        return false;
      },
    },
    {
      description: "Merge two paragraphs if direct siblings",
      normalize: ([node, path], editor) => {
        if (Path.hasPrevious(path)) {
          const [previousNode] = Editor.node(editor, Path.previous(path));
          if (isParagraph(previousNode) && (previousNode.serializeAsText || node.serializeAsText)) {
            Transforms.unsetNodes(editor, "serializeAsText", {
              at: Path.parent(path),
              mode: "all",
              match: isParagraph,
            });
            return true;
          }
        }
        return false;
      },
    },
    {
      description: "Unwrap sibling paragraphs if either has serializeAsText",
      normalize: ([node, path], editor) => {
        if (Editor.hasPath(editor, Path.next(path))) {
          const [nextNode] = Editor.node(editor, Path.next(path));
          if (isParagraph(nextNode) && (nextNode.serializeAsText || node.serializeAsText)) {
            Transforms.unsetNodes(editor, "serializeAsText", {
              at: Path.parent(path),
              mode: "all",
              match: isParagraph,
            });
            return true;
          }
        }
        return false;
      },
    },
    {
      description: "Unwrap block element children",
      normalize: ([_node, path], editor) => {
        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && !editor.isInline(child)) {
            Transforms.unwrapNodes(editor, { at: childPath });
            return true;
          }
        }
        return false;
      },
    },
  ],
});
