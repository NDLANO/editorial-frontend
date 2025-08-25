/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TYPE_NDLA_EMBED } from "./types";
import { defaultEmbedBlock } from "./utils";
import { parseEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const parsedData = parseEmbedTag(el.outerHTML);
    if (!parsedData) return;
    return defaultEmbedBlock(parsedData);
  },
  serialize() {
    return undefined;
  },
};
