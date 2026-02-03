/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createHtmlTag, createSerializer, parseElementAttributes } from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";
import { MATH_ELEMENT_TYPE } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";

export const mathmlSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== "math") return;
    const data = parseElementAttributes(Array.from(el.attributes));
    return slatejsx("element", { type: MATH_ELEMENT_TYPE, data: { ...data, innerHTML: el.innerHTML } }, [
      { text: el.textContent },
    ]);
  },
  serialize(node) {
    if (!isMathElement(node)) return;
    const { innerHTML, ...mathAttributes } = node.data;
    return createHtmlTag({ tag: "math", data: mathAttributes, children: innerHTML });
  },
});
