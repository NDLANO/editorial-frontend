/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { Editor, Node, Element, Descendant, Transforms, Text, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import onBackspace from "./handlers/onBackspace";
import onEnter from "./handlers/onEnter";
import onTab from "./handlers/onTab";
import { TYPE_LIST, TYPE_LIST_ITEM } from "./types";
import { defaultListBlock } from "./utils/defaultBlocks";
import { Dictionary } from "../../../../interfaces";
import { SlateSerializer } from "../../interfaces";
import { KEY_BACKSPACE, KEY_ENTER, KEY_TAB } from "../../utils/keys";
import { firstTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_BREAK } from "../break/types";
import { TYPE_COMMENT_INLINE } from "../comment/inline/types";
import { TYPE_CONCEPT_INLINE } from "../concept/inline/types";
import { TYPE_FOOTNOTE } from "../footnote/types";
import { TYPE_LINK, TYPE_CONTENT_LINK } from "../link/types";
import { TYPE_MATHML } from "../mathml/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface ListElement {
  type: "list";
  listType: string;
  data: Dictionary<string>;
  children: Descendant[];
}

export interface ListItemElement {
  type: "list-item";
  children: Descendant[];
  changeTo?: string;
  moveUp?: boolean;
  moveDown?: boolean;
}

const inlines = [TYPE_CONCEPT_INLINE, TYPE_FOOTNOTE, TYPE_LINK, TYPE_CONTENT_LINK, TYPE_MATHML, TYPE_COMMENT_INLINE];

export const listSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();

    // Transform children into a new array with all subsequent text/inlines wrapped into a paragraph with serializeAsText
    // Assures text/inlines in <li> will be parsed back to html without <p>-tag
    children = children.reduce((acc, cur) => {
      const lastElement = acc[acc.length - 1];
      if (!cur) {
        return acc;
      } else if (Element.isElement(cur) && !inlines.includes(cur.type)) {
        if (cur.type === TYPE_BREAK) {
          if (Element.isElement(lastElement) && lastElement.type === TYPE_PARAGRAPH && lastElement.serializeAsText) {
            lastElement.children.push({ text: "\n" });
          } else {
            acc.push(slatejsx("element", { type: TYPE_PARAGRAPH, serializeAsText: true }, { text: "\n" }));
          }
        } else {
          acc.push(cur);
        }
        return acc;
      } else if (Text.isText(cur) || (Element.isElement(cur) && inlines.includes(cur.type))) {
        if (Element.isElement(lastElement) && lastElement.type === TYPE_PARAGRAPH && lastElement.serializeAsText) {
          lastElement.children.push(cur);
          return acc;
        } else {
          acc.push(slatejsx("element", { type: TYPE_PARAGRAPH, serializeAsText: true }, cur));
          return acc;
        }
      }
      acc.push(cur);
      return acc;
    }, [] as Descendant[]);

    if (tag === "ul") {
      return slatejsx("element", { type: TYPE_LIST, listType: "bulleted-list", data: {} }, children);
    }
    if (tag === "ol") {
      const start = el.getAttribute("start");
      if (el.getAttribute("data-type") === "letters") {
        return slatejsx(
          "element",
          {
            type: TYPE_LIST,
            listType: "letter-list",
            data: { start: start ? start : undefined },
          },
          children,
        );
      }
      // Default to numbered list if no type is set.
      else {
        return slatejsx(
          "element",
          {
            type: TYPE_LIST,
            listType: "numbered-list",
            data: { start: start ? start : undefined },
          },
          children,
        );
      }
    }
    if (tag === "li") {
      return slatejsx("element", { type: TYPE_LIST_ITEM }, children);
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;

    if (node.type === TYPE_LIST) {
      if (node.listType === "bulleted-list") {
        return <ul>{children}</ul>;
      }
      if (node.listType === "numbered-list") {
        const { start } = node.data;
        return <ol start={start ? parseInt(start) : undefined}>{children}</ol>;
      }
      if (node.listType === "letter-list") {
        const { start } = node.data;
        return (
          <ol data-type="letters" start={start ? parseInt(start) : undefined}>
            {children}
          </ol>
        );
      }
    }
    if (node.type === TYPE_LIST_ITEM) {
      // If first child of list-item is a list, it means that an empty paragraph has been removed by
      // paragraph serializer. This should not be removed, therefore inserting it when serializing.
      const firstElement = children[0];
      const illegalFirstElement = !firstElement || ["ol", "ul"].includes(firstElement.type);
      return (
        <li>
          {!!illegalFirstElement && <p></p>}
          {children}
        </li>
      );
    }
  },
};

export const listPlugin = (editor: Editor) => {
  const { onKeyDown, normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_LIST_ITEM) {
      // If listItem is not placed insine list, unwrap it.
      const [parentNode] = Editor.node(editor, Path.parent(path));
      if (Element.isElement(parentNode) && parentNode.type !== TYPE_LIST) {
        return Transforms.unwrapNodes(editor, { at: path });
      }

      // If listItem contains text, wrap it in paragraph.
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(
            editor,
            {
              type: TYPE_PARAGRAPH,
              children: [{ text: "" }],
            },
            { at: childPath },
          );
          return;
        }
      }

      // If first child is not a paragraph, heading or quote, insert an empty paragraph
      const firstChild = node.children[0];
      if (Element.isElement(firstChild)) {
        if (!firstTextBlockElement.includes(firstChild.type)) {
          Transforms.insertNodes(
            editor,
            {
              type: TYPE_PARAGRAPH,
              children: [{ text: "" }],
            },
            { at: [...path, 0] },
          );
          return;
        }
      }

      // Handle changing list-items marked for listType change
      if (node.changeTo) {
        const changeTo = node.changeTo;
        Editor.withoutNormalizing(editor, () => {
          Transforms.unsetNodes(editor, ["changeTo"], { at: path });
          Transforms.wrapNodes(editor, defaultListBlock(changeTo), {
            at: path,
          });
          Transforms.liftNodes(editor, { at: path });
        });
        return;
      }
    }
    if (Element.isElement(node) && node.type === TYPE_LIST) {
      // If list is empty or zero-length text element, remove it
      if (node.children.length === 0 || (Text.isTextList(node.children) && Node.string(node) === "")) {
        return Transforms.removeNodes(editor, { at: path });
      }

      // If list contains elements of other type than list-item, wrap it
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!Element.isElement(child) || child.type !== TYPE_LIST_ITEM) {
          Transforms.wrapNodes(
            editor,
            {
              type: TYPE_LIST_ITEM,
              children: [],
            },
            { at: childPath },
          );
          return;
        }
      }
      // Merge list with previous list if identical type
      if (Path.hasPrevious(path)) {
        const prevPath = Path.previous(path);
        if (Editor.hasPath(editor, prevPath)) {
          const [prevNode] = Editor.node(editor, prevPath);

          if (Element.isElement(prevNode) && prevNode.type === TYPE_LIST) {
            if (node.listType === prevNode.listType) {
              return Transforms.mergeNodes(editor, {
                at: path,
              });
            }
          }
        }
      }

      // Merge list with next list if identical type
      const nextPath = Path.next(path);
      if (Editor.hasPath(editor, nextPath)) {
        const [nextNode] = Editor.node(editor, nextPath);

        if (Element.isElement(nextNode) && nextNode.type === TYPE_LIST) {
          if (node.listType === nextNode.listType && nextNode.children.length > 0) {
            return Transforms.mergeNodes(editor, {
              at: nextPath,
            });
          }
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEY_ENTER:
        return onEnter(event, editor, onKeyDown);
      case KEY_TAB:
        return onTab(event, editor, onKeyDown);
      case KEY_BACKSPACE:
        return onBackspace(event, editor, onKeyDown);
      default:
        if (onKeyDown) return onKeyDown(event);
        else return undefined;
    }
  };
  return editor;
};
