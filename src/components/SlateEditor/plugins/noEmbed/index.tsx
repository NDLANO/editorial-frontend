/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSerializer } from "@ndla/editor";
import { Embed } from "../../../../interfaces";
import { parseEmbedTag } from "../../../../util/embedTagHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { defaultEmbedBlock, isSlateEmbed } from "../embed/utils";

// TODO: Consider if this is needed after we implement the "unknown" embed

export const noEmbedSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node) {
    if (isSlateEmbed(node)) {
      return "<deleteme></deleteme>";
    }
  },
});
