/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createHtmlTag, createPlugin, createSerializer } from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";
import { isDivElement } from "./queries";
import { DIV_ELEMENT_TYPE, DIV_PLUGIN } from "./types";

export const divSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== "div") return;

    return slatejsx(
      "element",
      {
        type: DIV_ELEMENT_TYPE,
      },
      children,
    );
  },
  serialize(node, children) {
    if (!isDivElement(node)) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    return createHtmlTag({ tag: "div", children });
  },
});

export const divPlugin = createPlugin({ name: DIV_PLUGIN, type: DIV_ELEMENT_TYPE });
