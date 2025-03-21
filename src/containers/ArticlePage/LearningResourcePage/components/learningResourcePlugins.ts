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
import { blockQuotePlugin } from "../../../../components/SlateEditor/plugins/blockquote";
import { codeblockPlugin } from "../../../../components/SlateEditor/plugins/codeBlock";
import { commentBlockPlugin } from "../../../../components/SlateEditor/plugins/comment/block";
import { commentInlinePlugin } from "../../../../components/SlateEditor/plugins/comment/inline";
import { blockConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/block";
import { inlineConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/inline";
import { copyrightPlugin } from "../../../../components/SlateEditor/plugins/copyright";
import { definitionListPlugin } from "../../../../components/SlateEditor/plugins/definitionList";
import { detailsPlugin } from "../../../../components/SlateEditor/plugins/details";
import { divPlugin } from "../../../../components/SlateEditor/plugins/div";
import { dndPlugin } from "../../../../components/SlateEditor/plugins/DND";
import { embedPlugin } from "../../../../components/SlateEditor/plugins/embed";
import { externalPlugin } from "../../../../components/SlateEditor/plugins/external";
import { filePlugin } from "../../../../components/SlateEditor/plugins/file";
import { footnotePlugin } from "../../../../components/SlateEditor/plugins/footnote";
import { framedContentPlugin } from "../../../../components/SlateEditor/plugins/framedContent/framedContentPlugin";
import { gridPlugin } from "../../../../components/SlateEditor/plugins/grid";
import { h5pPlugin } from "../../../../components/SlateEditor/plugins/h5p";
import { imagePlugin } from "../../../../components/SlateEditor/plugins/image";
import { linkPlugin } from "../../../../components/SlateEditor/plugins/link";
import { mathmlPlugin } from "../../../../components/SlateEditor/plugins/mathml/mathPlugin";
import { relatedPlugin } from "../../../../components/SlateEditor/plugins/related";
import saveHotkeyPlugin from "../../../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../../../components/SlateEditor/plugins/span";
import { tablePlugin } from "../../../../components/SlateEditor/plugins/table";
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
import { inlineNavigationPlugin } from "@ndla/editor";
import { rephrasePlugin } from "../../../../components/SlateEditor/plugins/rephrase";

export const learningResourcePlugins: SlatePlugin[] = [
  inlineNavigationPlugin,
  sectionPlugin,
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  footnotePlugin,
  audioPlugin,
  imagePlugin(),
  h5pPlugin(),
  externalPlugin(),
  videoPlugin(),
  embedPlugin(),
  framedContentPlugin,
  blockQuotePlugin,
  linkPlugin,
  inlineConceptPlugin,
  blockConceptPlugin,
  commentInlinePlugin,
  commentBlockPlugin,
  headingPlugin,
  asidePlugin,
  detailsPlugin,
  // // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // // Blockquote and editList actions need to be triggered before paragraph action, else
  // // unwrapping (jumping out of block) will not work.
  tablePlugin,
  relatedPlugin,
  filePlugin,
  mathmlPlugin,
  codeblockPlugin,
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
  disclaimerPlugin,
  copyrightPlugin,
  rephrasePlugin,
];
