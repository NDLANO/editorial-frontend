/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_MATHML } from "./types";
import { onArrowDown, onArrowUp } from "./utils";
import { createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from "../../utils/keys";

export interface MathmlElement {
  type: "mathml";
  data: { [key: string]: string };
  children: Descendant[];
  isFirstEdit?: boolean;
}

export const mathmlSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== "math") return;
    return slatejsx(
      "element",
      {
        type: TYPE_MATHML,
        data: { ...parseElementAttributes(Array.from(el.attributes)), innerHTML: el.innerHTML },
      },
      [{ text: el.textContent }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== "mathml") return;
    const { innerHTML, ...mathAttributes } = node.data;
    return createHtmlTag({ tag: "math", data: mathAttributes, children: innerHTML });
  },
};

export const mathmlPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, isVoid: nextIsVoid, onKeyDown } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_MATHML) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_MATHML) {
      return true;
    }
    return nextIsVoid(element);
  };

  editor.onKeyDown = (e) => {
    if (e.key === KEY_ARROW_UP) {
      onArrowUp(e, editor, onKeyDown);
    } else if (e.key === KEY_ARROW_DOWN) {
      onArrowDown(e, editor, onKeyDown);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return editor;
};
