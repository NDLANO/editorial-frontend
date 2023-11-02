/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import { noEmbedPlugin } from '../../../../components/SlateEditor/plugins/noEmbed';
import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { definitionListPlugin } from '../../../../components/SlateEditor/plugins/definitionList';

// Plugins are checked from last to first
export const topicArticlePlugins: SlatePlugin[] = [
  sectionPlugin,
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  noEmbedPlugin,
  linkPlugin,
  headingPlugin,
  // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // Blockquote and editList actions need to be triggered before paragraph action, else
  // unwrapping (jumping out of block) will not work.
  blockQuotePlugin,
  definitionListPlugin,
  listPlugin,
  inlineConceptPlugin,
  mathmlPlugin,
  markPlugin,
  dndPlugin,
  toolbarPlugin,
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
];
