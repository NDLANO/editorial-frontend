/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { asidePlugin } from "../../../../components/SlateEditor/plugins/aside/asidePlugin";
import { audioPlugin } from "../../../../components/SlateEditor/plugins/audio/audioPlugin";
import { blockPickerPlugin } from "../../../../components/SlateEditor/plugins/blockPicker";
import { blockQuotePlugin } from "../../../../components/SlateEditor/plugins/blockquote/blockquotePlugin";
import { campaignBlockPlugin } from "../../../../components/SlateEditor/plugins/campaignBlock";
import { codeblockPlugin } from "../../../../components/SlateEditor/plugins/codeBlock";
import { commentBlockPlugin } from "../../../../components/SlateEditor/plugins/comment/block";
import { commentInlinePlugin } from "../../../../components/SlateEditor/plugins/comment/inline";
import { blockConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/block";
import { inlineConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/inline";
import { contactBlockPlugin } from "../../../../components/SlateEditor/plugins/contactBlock";
import { copyrightPlugin } from "../../../../components/SlateEditor/plugins/copyright";
import { detailsPlugin } from "../../../../components/SlateEditor/plugins/details/detailsPlugin";
import { summaryPlugin } from "../../../../components/SlateEditor/plugins/details/summaryPlugin";
import { divPlugin } from "../../../../components/SlateEditor/plugins/div";
import { dndPlugin } from "../../../../components/SlateEditor/plugins/DND/dndPlugin";
import { externalPlugin, iframePlugin } from "../../../../components/SlateEditor/plugins/external";
import { filePlugin } from "../../../../components/SlateEditor/plugins/file";
import { footnotePlugin } from "../../../../components/SlateEditor/plugins/footnote";
import { framedContentPlugin } from "../../../../components/SlateEditor/plugins/framedContent/framedContentPlugin";
import { gridPlugin } from "../../../../components/SlateEditor/plugins/grid/gridPlugin";
import { gridCellPlugin } from "../../../../components/SlateEditor/plugins/grid/gridCellPlugin";
import { h5pPlugin } from "../../../../components/SlateEditor/plugins/h5p";
import { imagePlugin } from "../../../../components/SlateEditor/plugins/image";
import { keyFigurePlugin } from "../../../../components/SlateEditor/plugins/keyFigure";
import { contentLinkPlugin, linkPlugin } from "../../../../components/SlateEditor/plugins/link";
import { linkBlockListPlugin } from "../../../../components/SlateEditor/plugins/linkBlockList";
import { mathmlPlugin } from "../../../../components/SlateEditor/plugins/mathml/mathPlugin";
import { pitchPlugin } from "../../../../components/SlateEditor/plugins/pitch";
import { relatedPlugin } from "../../../../components/SlateEditor/plugins/related";
import saveHotkeyPlugin from "../../../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../../../components/SlateEditor/plugins/span";
import { tablePlugin } from "../../../../components/SlateEditor/plugins/table/tablePlugin";
import { tableCaptionPlugin } from "../../../../components/SlateEditor/plugins/table/tableCaptionPlugin";
import {
  tableCellHeaderPlugin,
  tableCellPlugin,
} from "../../../../components/SlateEditor/plugins/table/tableCellPlugins";
import { tableBodyPlugin } from "../../../../components/SlateEditor/plugins/table/tableBodyPlugin";
import { tableRowPlugin } from "../../../../components/SlateEditor/plugins/table/tableRowPlugin";
import { textTransformPlugin } from "../../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../../components/SlateEditor/plugins/toolbar";
import { disclaimerPlugin } from "../../../../components/SlateEditor/plugins/uuDisclaimer";
import { videoPlugin } from "../../../../components/SlateEditor/plugins/video";
import { paragraphPlugin } from "../../../../components/SlateEditor/plugins/paragraph";
import { sectionPlugin } from "../../../../components/SlateEditor/plugins/section";
import { headingPlugin } from "../../../../components/SlateEditor/plugins/heading";
import { breakPlugin } from "../../../../components/SlateEditor/plugins/break";
import { markPlugin } from "../../../../components/SlateEditor/plugins/mark";
import { listPlugin } from "../../../../components/SlateEditor/plugins/list";
import { idPlugin } from "../../../../components/SlateEditor/plugins/id/idPlugin";
import { rephrasePlugin } from "../../../../components/SlateEditor/plugins/rephrase/rephrasePlugin";
import { definitionListPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionListPlugin";
import { definitionTermPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionTermPlugin";
import { definitionDescriptionPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionDescriptionPlugin";
import { symbolPlugin } from "../../../../components/SlateEditor/plugins/symbol";
import { tableHeadPlugin } from "../../../../components/SlateEditor/plugins/table/tableHeadPlugin";
import { unsupportedPlugin } from "../../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import { pastePlugin } from "../../../../components/SlateEditor/plugins/paste";

// Plugins are checked from last to first
export const frontpagePlugins: SlatePlugin[] = [
  idPlugin,
  sectionPlugin,
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  footnotePlugin,
  externalPlugin,
  iframePlugin,
  audioPlugin,
  imagePlugin,
  h5pPlugin,
  videoPlugin,
  framedContentPlugin,
  blockQuotePlugin,
  linkPlugin,
  contentLinkPlugin,
  inlineConceptPlugin,
  blockConceptPlugin,
  commentInlinePlugin,
  commentBlockPlugin,
  headingPlugin,
  asidePlugin,
  detailsPlugin,
  summaryPlugin,
  // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // // Blockquote and editList actions need to be triggered before paragraph action, else
  // // unwrapping (jumping out of block) will not work.
  tablePlugin,
  tableCaptionPlugin,
  tableCellPlugin,
  tableCellHeaderPlugin,
  tableBodyPlugin,
  tableHeadPlugin,
  tableRowPlugin,
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
  definitionTermPlugin,
  definitionDescriptionPlugin,
  listPlugin,
  gridCellPlugin,
  gridPlugin,
  pitchPlugin,
  campaignBlockPlugin,
  linkBlockListPlugin,
  disclaimerPlugin,
  copyrightPlugin,
  rephrasePlugin,
  symbolPlugin,
  unsupportedPlugin,
  pastePlugin,
];
