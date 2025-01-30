/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_BREAK } from "./types";
import { createHtmlTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";

export interface BreakElement {
  type: "br";
  children: Descendant[];
}

const allowedBreakContainers = [
  "section",
  "div",
  "aside",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "summary",
  "pre",
];

export const breakSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_BREAK) return;

    if (el.parentElement && el.parentElement.tagName) {
      const tagName = el.parentElement.tagName.toLowerCase();
      if (allowedBreakContainers.includes(tagName)) {
        return slatejsx("element", { type: TYPE_BREAK }, [{ text: "" }]);
      }
    }
    return slatejsx("text", { text: "\n" });
  },
  serialize(node) {
    if (!Element.isElement(node)) return;
    if (node.type !== "br") return;
    return createHtmlTag({ tag: "br", shorthand: true });
  },
};

export const breakPlugin = (editor: Editor) => {
  const { isVoid: nextIsVoid } = editor;

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_BREAK) {
      return true;
    }
    return nextIsVoid(element);
  };
  return editor;
};
