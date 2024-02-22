/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { asideRenderer } from "../../../../components/SlateEditor/plugins/aside/render";
import { audioRenderer } from "../../../../components/SlateEditor/plugins/audio/render";
import { blockQuoteRenderer } from "../../../../components/SlateEditor/plugins/blockquote/render";
import { blogPostRenderer } from "../../../../components/SlateEditor/plugins/blogPost/render";
import { breakRenderer } from "../../../../components/SlateEditor/plugins/break/render";
import { campaignBlockRenderer } from "../../../../components/SlateEditor/plugins/campaignBlock/render";
import { codeblockRenderer } from "../../../../components/SlateEditor/plugins/codeBlock/render";
import { blockConceptRenderer } from "../../../../components/SlateEditor/plugins/concept/block/render";
import { inlineConceptRenderer } from "../../../../components/SlateEditor/plugins/concept/inline/render";
import { conceptListRenderer } from "../../../../components/SlateEditor/plugins/conceptList/render";
import { contactBlockRenderer } from "../../../../components/SlateEditor/plugins/contactBlock/render";
import { definitionListRenderer } from "../../../../components/SlateEditor/plugins/definitionList/render";
import { detailsRenderer } from "../../../../components/SlateEditor/plugins/details/render";
import { divRenderer } from "../../../../components/SlateEditor/plugins/div/render";
import { embedRenderer } from "../../../../components/SlateEditor/plugins/embed/render";
import { externalRenderer } from "../../../../components/SlateEditor/plugins/external/render";
import { fileRenderer } from "../../../../components/SlateEditor/plugins/file/render";
import { footnoteRenderer } from "../../../../components/SlateEditor/plugins/footnote/render";
import { framedContentRenderer } from "../../../../components/SlateEditor/plugins/framedContent/render";
import { gridRenderer } from "../../../../components/SlateEditor/plugins/grid/render";
import { h5pRenderer } from "../../../../components/SlateEditor/plugins/h5p/render";
import { headingRenderer } from "../../../../components/SlateEditor/plugins/heading/render";
import { keyFigureRenderer } from "../../../../components/SlateEditor/plugins/keyFigure/render";
import { linkRenderer } from "../../../../components/SlateEditor/plugins/link/render";
import { linkBlockListRenderer } from "../../../../components/SlateEditor/plugins/linkBlockList/render";
import { listRenderer } from "../../../../components/SlateEditor/plugins/list/render";
import { markRenderer } from "../../../../components/SlateEditor/plugins/mark/render";
import { mathRenderer } from "../../../../components/SlateEditor/plugins/mathml/mathRenderer";
import { paragraphRenderer } from "../../../../components/SlateEditor/plugins/paragraph/render";
import { relatedRenderer } from "../../../../components/SlateEditor/plugins/related/relatedRenderer";
import { sectionRenderer } from "../../../../components/SlateEditor/plugins/section/render";
import { spanRenderer } from "../../../../components/SlateEditor/plugins/span/render";
import { tableRenderer } from "../../../../components/SlateEditor/plugins/table/render";
import { disclaimerRenderer } from "../../../../components/SlateEditor/plugins/uuDisclaimer/render";

// Plugins are checked from last to first
export const frontpageRenderers: SlatePlugin[] = [
  sectionRenderer,
  spanRenderer,
  divRenderer,
  paragraphRenderer,
  footnoteRenderer,
  externalRenderer,
  embedRenderer(),
  audioRenderer,
  h5pRenderer,
  framedContentRenderer,
  asideRenderer,
  detailsRenderer,
  blockQuoteRenderer,
  linkRenderer,
  conceptListRenderer,
  inlineConceptRenderer,
  blockConceptRenderer,
  headingRenderer,
  // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // // Blockquote and editList actions need to be triggered before paragraph action, else
  // // unwrapping (jumping out of block) will not work.
  tableRenderer,
  relatedRenderer,
  fileRenderer,
  mathRenderer,
  contactBlockRenderer,
  codeblockRenderer,
  keyFigureRenderer,
  breakRenderer,
  markRenderer,
  definitionListRenderer,
  listRenderer,
  gridRenderer,
  blogPostRenderer,
  campaignBlockRenderer,
  linkBlockListRenderer,
  disclaimerRenderer,
];
