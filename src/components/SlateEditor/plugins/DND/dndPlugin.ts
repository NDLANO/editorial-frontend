/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";

export const dndPlugin = createPlugin<any, DndPluginOptions>({
  name: DND_PLUGIN,
  options: {
    disabledElements: [
      "section",
      "summary",
      "list-item",
      "definition-description",
      "definition-term",
      "table-cell-header",
      "table-head",
      "table-body",
      "table-cell",
      "table-caption",
      "table-row",
      "br",
    ],
    legalChildren: {
      "list-item": [],
      summary: [],
      aside: [
        "paragraph",
        "table",
        "image",
        "brightcove-embed",
        "audio",
        "h5p",
        "iframe",
        "external",
        "file",
        "code-block",
        "comment-block",
        "grid",
        "list",
        "definition-list",
        "key-figure",
        "pitch",
        "error-embed",
        "campaign-block",
        "gloss-block",
        "quote",
        "link-block-list",
      ],
      details: [
        "table",
        "image",
        "paragraph",
        "brightcove-embed",
        "audio",
        "h5p",
        "iframe",
        "external",
        "file",
        "code-block",
        "comment-block",
        "grid",
        "list",
        "definition-list",
        "key-figure",
        "pitch",
        "error-embed",
        "campaign-block",
        "gloss-block",
        "quote",
        "link-block-list",
      ],
      grid: ["paragraph", "image", "quote", "list", "definition-list"],
      quote: ["paragraph"],
    },
  },
});
