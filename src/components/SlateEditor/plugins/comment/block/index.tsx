/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT_BLOCK } from "./types";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const commentBlockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource === "comment" && embedAttributes.type === "block") {
      return slatejsx("element", { type: TYPE_COMMENT_BLOCK, data: embedAttributes });
    }
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_COMMENT_BLOCK || !node.data) return;
    return createEmbedTagV2(node.data);
  },
};
