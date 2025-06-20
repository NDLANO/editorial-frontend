/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createSerializer,
  isElementOfType,
  parseElementAttributes,
} from "@ndla/editor";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { AUDIO_ELEMENT_TYPE } from "./audioTypes";

export const audioSerializer = createSerializer({
  deserialize: (el) => {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== AUDIO_ELEMENT_TYPE) return;
    return slatejsx("element", { type: AUDIO_ELEMENT_TYPE, data: embedAttributes }, { text: "" });
  },
  serialize: (node) => {
    if (!isElementOfType(node, AUDIO_ELEMENT_TYPE) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});
