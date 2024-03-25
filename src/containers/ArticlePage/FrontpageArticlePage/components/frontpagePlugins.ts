/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { asidePlugin } from "../../../../components/SlateEditor/plugins/aside";
import { audioPlugin } from "../../../../components/SlateEditor/plugins/audio";
import { blockPickerPlugin } from "../../../../components/SlateEditor/plugins/blockPicker";
import { blockQuotePlugin } from "../../../../components/SlateEditor/plugins/blockquote";
import { blogPostPlugin } from "../../../../components/SlateEditor/plugins/blogPost";
import { breakPlugin } from "../../../../components/SlateEditor/plugins/break";
import { campaignBlockPlugin } from "../../../../components/SlateEditor/plugins/campaignBlock";
import { codeblockPlugin } from "../../../../components/SlateEditor/plugins/codeBlock";
import { blockConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/block";
import { inlineConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/inline";
import { conceptListPlugin } from "../../../../components/SlateEditor/plugins/conceptList";
import { contactBlockPlugin } from "../../../../components/SlateEditor/plugins/contactBlock";
import { copyrightPlugin } from "../../../../components/SlateEditor/plugins/copyright";
import { definitionListPlugin } from "../../../../components/SlateEditor/plugins/definitionList";
import { detailsPlugin } from "../../../../components/SlateEditor/plugins/details";
import { divPlugin } from "../../../../components/SlateEditor/plugins/div";
import { dndPlugin } from "../../../../components/SlateEditor/plugins/DND";
import { embedPlugin } from "../../../../components/SlateEditor/plugins/embed";
import { externalPlugin } from "../../../../components/SlateEditor/plugins/external";
import { filePlugin } from "../../../../components/SlateEditor/plugins/file";
import { footnotePlugin } from "../../../../components/SlateEditor/plugins/footnote";
import { framedContentPlugin } from "../../../../components/SlateEditor/plugins/framedContent";
import { gridPlugin } from "../../../../components/SlateEditor/plugins/grid";
import { h5pPlugin } from "../../../../components/SlateEditor/plugins/h5p";
import { headingPlugin } from "../../../../components/SlateEditor/plugins/heading";
import { keyFigurePlugin } from "../../../../components/SlateEditor/plugins/keyFigure";
import { linkPlugin } from "../../../../components/SlateEditor/plugins/link";
import { linkBlockListPlugin } from "../../../../components/SlateEditor/plugins/linkBlockList";
import { listPlugin } from "../../../../components/SlateEditor/plugins/list";
import { markPlugin } from "../../../../components/SlateEditor/plugins/mark";
import { mathmlPlugin } from "../../../../components/SlateEditor/plugins/mathml";
import { paragraphPlugin } from "../../../../components/SlateEditor/plugins/paragraph";
import { relatedPlugin } from "../../../../components/SlateEditor/plugins/related";
import saveHotkeyPlugin from "../../../../components/SlateEditor/plugins/saveHotkey";
import { sectionPlugin } from "../../../../components/SlateEditor/plugins/section";
import { spanPlugin } from "../../../../components/SlateEditor/plugins/span";
import { tablePlugin } from "../../../../components/SlateEditor/plugins/table";
import { textTransformPlugin } from "../../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../../components/SlateEditor/plugins/toolbar";
import { disclaimerPlugin } from "../../../../components/SlateEditor/plugins/uuDisclaimer";

// Plugins are checked from last to first
export const frontpagePlugins: SlatePlugin[] = [
  sectionPlugin,
  spanPlugin,
  divPlugin,
  ...paragraphPlugin,
  footnotePlugin,
  externalPlugin(),
  embedPlugin(),
  audioPlugin(),
  h5pPlugin(),
  framedContentPlugin,
  blockQuotePlugin,
  linkPlugin,
  conceptListPlugin,
  inlineConceptPlugin,
  blockConceptPlugin,
  headingPlugin,
  asidePlugin,
  ...detailsPlugin,
  // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // // Blockquote and editList actions need to be triggered before paragraph action, else
  // // unwrapping (jumping out of block) will not work.
  tablePlugin,
  relatedPlugin,
  filePlugin,
  mathmlPlugin,
  contactBlockPlugin,
  codeblockPlugin,
  ...keyFigurePlugin,
  blockPickerPlugin,
  dndPlugin,
  toolbarPlugin(),
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
  disclaimerPlugin,
  copyrightPlugin,
];
