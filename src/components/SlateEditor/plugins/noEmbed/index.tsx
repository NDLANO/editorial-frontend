/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor } from "slate";
import { Embed } from "../../../../interfaces";
import { parseEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { defaultEmbedBlock, isSlateEmbed } from "../embed/utils";

export const noEmbedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node: Descendant) {
    if (isSlateEmbed(node)) {
      // @ts-expect-error delemete does not exist in JSX.
      return <deleteme></deleteme>;
    }
  },
};

export const noEmbedPlugin = (editor: Editor) => {
  return editor;
};
