/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { asideRenderer } from '../../../../components/SlateEditor/plugins/aside/render';
import { audioRenderer } from '../../../../components/SlateEditor/plugins/audio/render';
import { blockQuoteRenderer } from '../../../../components/SlateEditor/plugins/blockquote/render';
import { breakRenderer } from '../../../../components/SlateEditor/plugins/break/render';
import { codeblockRenderer } from '../../../../components/SlateEditor/plugins/codeBlock/render';
import { blockConceptRenderer } from '../../../../components/SlateEditor/plugins/concept/block/render';
import { inlineConceptRenderer } from '../../../../components/SlateEditor/plugins/concept/inline/render';
import { conceptListRenderer } from '../../../../components/SlateEditor/plugins/conceptList/render';
import { definitionListRenderer } from '../../../../components/SlateEditor/plugins/definitionList/render';
import { detailsRenderer } from '../../../../components/SlateEditor/plugins/details/render';
import { divRenderer } from '../../../../components/SlateEditor/plugins/div/render';
import { embedRenderer } from '../../../../components/SlateEditor/plugins/embed/render';
import { fileRenderer } from '../../../../components/SlateEditor/plugins/file/render';
import { footnoteRenderer } from '../../../../components/SlateEditor/plugins/footnote/render';
import { framedContentRenderer } from '../../../../components/SlateEditor/plugins/framedContent/render';
import { gridRenderer } from '../../../../components/SlateEditor/plugins/grid/render';
import { h5pRenderer } from '../../../../components/SlateEditor/plugins/h5p/render';
import { headingRenderer } from '../../../../components/SlateEditor/plugins/heading/render';
import { linkRenderer } from '../../../../components/SlateEditor/plugins/link/render';
import { listRenderer } from '../../../../components/SlateEditor/plugins/list/render';
import { markRenderer } from '../../../../components/SlateEditor/plugins/mark/render';
import { mathRenderer } from '../../../../components/SlateEditor/plugins/mathml/mathRenderer';
import { paragraphRenderer } from '../../../../components/SlateEditor/plugins/paragraph/render';
import { relatedRenderer } from '../../../../components/SlateEditor/plugins/related/relatedRenderer';
import { sectionRenderer } from '../../../../components/SlateEditor/plugins/section/render';
import { tableRenderer } from '../../../../components/SlateEditor/plugins/table/render';

// Plugins are checked from last to first
export const learningResourceRenderers = (articleLanguage: string): SlatePlugin[] => {
  return [
    sectionRenderer,
    divRenderer,
    paragraphRenderer(articleLanguage),
    footnoteRenderer,
    audioRenderer(articleLanguage),
    h5pRenderer(articleLanguage),
    embedRenderer(articleLanguage),
    framedContentRenderer,
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
    codeblockRenderer,
    breakRenderer,
    markRenderer,
    definitionListRenderer,
    listRenderer,
    gridRenderer,
  ];
};
