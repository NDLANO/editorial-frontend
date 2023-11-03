/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from '../../../../components/SlateEditor/interfaces';
import { codeblockPlugin } from '../../../../components/SlateEditor/plugins/codeBlock';
import { footnotePlugin } from '../../../../components/SlateEditor/plugins/footnote';
import { embedPlugin } from '../../../../components/SlateEditor/plugins/embed';
import { bodyboxPlugin } from '../../../../components/SlateEditor/plugins/bodybox';
import { asidePlugin } from '../../../../components/SlateEditor/plugins/aside';
import { detailsPlugin } from '../../../../components/SlateEditor/plugins/details';
import { linkPlugin } from '../../../../components/SlateEditor/plugins/link';
import { headingPlugin } from '../../../../components/SlateEditor/plugins/heading';
import { blockPickerPlugin } from '../../../../components/SlateEditor/plugins/blockPicker';
import { relatedPlugin } from '../../../../components/SlateEditor/plugins/related';
import { filePlugin } from '../../../../components/SlateEditor/plugins/file';
import { blockQuotePlugin } from '../../../../components/SlateEditor/plugins/blockquote';
import { paragraphPlugin } from '../../../../components/SlateEditor/plugins/paragraph';
import { mathmlPlugin } from '../../../../components/SlateEditor/plugins/mathml';
import { textTransformPlugin } from '../../../../components/SlateEditor/plugins/textTransform';
import { tablePlugin } from '../../../../components/SlateEditor/plugins/table';
import { toolbarPlugin } from '../../../../components/SlateEditor/plugins/toolbar';
import saveHotkeyPlugin from '../../../../components/SlateEditor/plugins/saveHotkey';
import { sectionPlugin } from '../../../../components/SlateEditor/plugins/section';
import { breakPlugin } from '../../../../components/SlateEditor/plugins/break';
import { markPlugin } from '../../../../components/SlateEditor/plugins/mark';
import { listPlugin } from '../../../../components/SlateEditor/plugins/list';
import { divPlugin } from '../../../../components/SlateEditor/plugins/div';
import { dndPlugin } from '../../../../components/SlateEditor/plugins/DND';
import { spanPlugin } from '../../../../components/SlateEditor/plugins/span';
import { conceptListPlugin } from '../../../../components/SlateEditor/plugins/conceptList';
import { inlineConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/inline';
import { blockConceptPlugin } from '../../../../components/SlateEditor/plugins/concept/block';
import { definitionListPlugin } from '../../../../components/SlateEditor/plugins/definitionList';
import { contactBlockPlugin } from '../../../../components/SlateEditor/plugins/contactBlock';
import { blogPostPlugin } from '../../../../components/SlateEditor/plugins/blogPost';
import { gridPlugin } from '../../../../components/SlateEditor/plugins/grid';
import { keyFigurePlugin } from '../../../../components/SlateEditor/plugins/keyFigure';
import { campaignBlockPlugin } from '../../../../components/SlateEditor/plugins/campaignBlock';
import { linkBlockListPlugin } from '../../../../components/SlateEditor/plugins/linkBlockList';
import { audioPlugin } from '../../../../components/SlateEditor/plugins/audio';
import { h5pPlugin } from '../../../../components/SlateEditor/plugins/h5p';

// Plugins are checked from last to first
export const frontpagePlugins: SlatePlugin[] = [
  sectionPlugin,
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  footnotePlugin,
  embedPlugin(),
  audioPlugin(),
  h5pPlugin(),
  bodyboxPlugin,
  asidePlugin,
  detailsPlugin,
  blockQuotePlugin,
  linkPlugin,
  conceptListPlugin,
  inlineConceptPlugin,
  blockConceptPlugin,
  headingPlugin,
  // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // // Blockquote and editList actions need to be triggered before paragraph action, else
  // // unwrapping (jumping out of block) will not work.
  tablePlugin,
  relatedPlugin,
  filePlugin,
  mathmlPlugin,
  contactBlockPlugin,
  codeblockPlugin,
  keyFigurePlugin,
  blockPickerPlugin,
  dndPlugin,
  toolbarPlugin,
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  definitionListPlugin,
  listPlugin,
  gridPlugin,
  blogPostPlugin,
  campaignBlockPlugin,
  linkBlockListPlugin,
];
