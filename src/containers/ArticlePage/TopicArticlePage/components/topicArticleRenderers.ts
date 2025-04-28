/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { blockQuoteRenderer } from "../../../../components/SlateEditor/plugins/blockquote/render";
import { breakRenderer } from "../../../../components/SlateEditor/plugins/break/render";
import { commentInlineRenderer } from "../../../../components/SlateEditor/plugins/comment/inline/render";
import { inlineConceptRenderer } from "../../../../components/SlateEditor/plugins/concept/inline/render";
import { definitionListRenderer } from "../../../../components/SlateEditor/plugins/definitionList/render";
import { divRenderer } from "../../../../components/SlateEditor/plugins/div/render";
import { headingRenderer } from "../../../../components/SlateEditor/plugins/heading/render";
import { linkRenderer } from "../../../../components/SlateEditor/plugins/link/render";
import { listRenderer } from "../../../../components/SlateEditor/plugins/list/render";
import { markRenderer } from "../../../../components/SlateEditor/plugins/mark/render";
import { mathRenderer } from "../../../../components/SlateEditor/plugins/mathml/mathRenderer";
import { noEmbedRenderer } from "../../../../components/SlateEditor/plugins/noEmbed/render";
import { paragraphRenderer } from "../../../../components/SlateEditor/plugins/paragraph/render";
import { rephraseRenderer } from "../../../../components/SlateEditor/plugins/rephrase/render";
import { sectionRenderer } from "../../../../components/SlateEditor/plugins/section/render";
import { spanRenderer } from "../../../../components/SlateEditor/plugins/span/render";
import { symbolRenderer } from "../../../../components/SlateEditor/plugins/symbol/render";

// Plugins are checked from last to first
export const topicArticleRenderers: SlatePlugin[] = [
  sectionRenderer,
  spanRenderer,
  divRenderer,
  paragraphRenderer,
  noEmbedRenderer,
  linkRenderer,
  headingRenderer,
  // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // Blockquote and editList actions need to be triggered before paragraph action, else
  // unwrapping (jumping out of block) will not work.
  blockQuoteRenderer,
  definitionListRenderer,
  listRenderer,
  inlineConceptRenderer,
  commentInlineRenderer,
  mathRenderer,
  markRenderer,
  breakRenderer,
  rephraseRenderer,
  symbolRenderer,
];
