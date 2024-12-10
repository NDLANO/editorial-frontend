/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { Editor, Element, Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DIV } from "./types";
import { SlateSerializer } from "../../interfaces";

export interface DivElement {
  type: "div";
  data?: {
    align?: string;
  };
  children: Descendant[];
}

export const divSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "div") return;

    return slatejsx(
      "element",
      {
        type: TYPE_DIV,
      },
      children,
    );
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_DIV) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    return <div>{children}</div>;
  },
};

export const divPlugin = (editor: Editor) => {
  return editor;
};
