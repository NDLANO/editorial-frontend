/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { sectionRenderer } from '../../../../components/SlateEditor/plugins/section/render';
import { spanRenderer } from '../../../../components/SlateEditor/plugins/span/render';
import { divRenderer } from '../../../../components/SlateEditor/plugins/div/render';
import { paragraphRenderer } from '../../../../components/SlateEditor/plugins/paragraph/render';
import { footnoteRenderer } from '../../../../components/SlateEditor/plugins/footnote/render';
import { audioRenderer } from '../../../../components/SlateEditor/plugins/audio/render';
import { h5pRenderer } from '../../../../components/SlateEditor/plugins/h5p/render';
import { embedRenderer } from '../../../../components/SlateEditor/plugins/embed/render';
import { bodyboxRenderer } from '../../../../components/SlateEditor/plugins/bodybox/render';
import { asideRenderer } from '../../../../components/SlateEditor/plugins/aside/render';
import { detailsRenderer } from '../../../../components/SlateEditor/plugins/details/render';
import { blockQuoteRenderer } from '../../../../components/SlateEditor/plugins/blockquote/render';
import { linkRenderer } from '../../../../components/SlateEditor/plugins/link/render';
import { conceptListRenderer } from '../../../../components/SlateEditor/plugins/conceptList/render';
import { inlineConceptRenderer } from '../../../../components/SlateEditor/plugins/concept/inline/render';
import { blockConceptRenderer } from '../../../../components/SlateEditor/plugins/concept/block/render';
import { headingRenderer } from '../../../../components/SlateEditor/plugins/heading/render';
import { tableRenderer } from '../../../../components/SlateEditor/plugins/table/render';
import { relatedRenderer } from '../../../../components/SlateEditor/plugins/related/relatedRenderer';
import { fileRenderer } from '../../../../components/SlateEditor/plugins/file/render';
import { mathRenderer } from '../../../../components/SlateEditor/plugins/mathml/mathRenderer';
import { codeblockRenderer } from '../../../../components/SlateEditor/plugins/codeBlock/render';
import { breakRenderer } from '../../../../components/SlateEditor/plugins/break/render';
import { markRenderer } from '../../../../components/SlateEditor/plugins/mark/render';
import { definitionListRenderer } from '../../../../components/SlateEditor/plugins/definitionList/render';
import { listRenderer } from '../../../../components/SlateEditor/plugins/list/render';
import { gridRenderer } from '../../../../components/SlateEditor/plugins/grid/render';
import { contactBlockRenderer } from '../../../../components/SlateEditor/plugins/contactBlock/render';
import { keyFigureRenderer } from '../../../../components/SlateEditor/plugins/keyFigure/render';
import { blogPostRenderer } from '../../../../components/SlateEditor/plugins/blogPost/render';
import { campaignBlockRenderer } from '../../../../components/SlateEditor/plugins/campaignBlock/render';
import { linkBlockListRenderer } from '../../../../components/SlateEditor/plugins/linkBlockList/render';

// Plugins are checked from last to first
export const frontpageRenderers = (articleLanguage: string): SlatePlugin[] => [
  sectionRenderer,
  spanRenderer,
  divRenderer,
  paragraphRenderer(articleLanguage),
  footnoteRenderer,
  embedRenderer(articleLanguage),
  audioRenderer(articleLanguage),
  h5pRenderer(articleLanguage),
  bodyboxRenderer,
  asideRenderer,
  detailsRenderer,
  blockQuoteRenderer,
  linkRenderer(articleLanguage),
  conceptListRenderer(articleLanguage),
  inlineConceptRenderer(articleLanguage),
  blockConceptRenderer(articleLanguage),
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
];
