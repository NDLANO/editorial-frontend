/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../../components/SlateEditor/interfaces";
import { blockQuotePlugin } from "../../../../components/SlateEditor/plugins/blockquote/blockquotePlugin";
import { commentInlinePlugin } from "../../../../components/SlateEditor/plugins/comment/inline";
import { inlineConceptPlugin } from "../../../../components/SlateEditor/plugins/concept/inline";
import { divPlugin } from "../../../../components/SlateEditor/plugins/div";
import { dndPlugin } from "../../../../components/SlateEditor/plugins/DND/dndPlugin";
import { contentLinkPlugin, linkPlugin } from "../../../../components/SlateEditor/plugins/link";
import { mathmlPlugin } from "../../../../components/SlateEditor/plugins/mathml/mathPlugin";
import saveHotkeyPlugin from "../../../../components/SlateEditor/plugins/saveHotkey";
import { sectionPlugin } from "../../../../components/SlateEditor/plugins/section";
import { spanPlugin } from "../../../../components/SlateEditor/plugins/span";
import { textTransformPlugin } from "../../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../../components/SlateEditor/plugins/toolbar";
import { paragraphPlugin } from "../../../../components/SlateEditor/plugins/paragraph";
import { headingPlugin } from "../../../../components/SlateEditor/plugins/heading";
import { listPlugin } from "../../../../components/SlateEditor/plugins/list";
import { markPlugin } from "../../../../components/SlateEditor/plugins/mark";
import { breakPlugin } from "../../../../components/SlateEditor/plugins/break";
import { inlineNavigationPlugin } from "@ndla/editor";
import { idPlugin } from "../../../../components/SlateEditor/plugins/id/idPlugin";
import { rephrasePlugin } from "../../../../components/SlateEditor/plugins/rephrase/rephrasePlugin";
import { definitionListPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionListPlugin";
import { definitionTermPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionTermPlugin";
import { definitionDescriptionPlugin } from "../../../../components/SlateEditor/plugins/definitionList/definitionDescriptionPlugin";
import { symbolPlugin } from "../../../../components/SlateEditor/plugins/symbol";
import { unsupportedPlugin } from "../../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import { pastePlugin } from "../../../../components/SlateEditor/plugins/paste";

// Plugins are checked from last to first
export const topicArticlePlugins: SlatePlugin[] = [
  idPlugin,
  inlineNavigationPlugin,
  sectionPlugin,
  spanPlugin,
  divPlugin,
  paragraphPlugin,
  linkPlugin,
  contentLinkPlugin,
  headingPlugin,
  // Paragraph-, blockquote- and editList-plugin listens for Enter press on empty lines.
  // Blockquote and editList actions need to be triggered before paragraph action, else
  // unwrapping (jumping out of block) will not work.
  blockQuotePlugin,
  definitionListPlugin,
  definitionDescriptionPlugin,
  definitionTermPlugin,
  listPlugin,
  inlineConceptPlugin,
  commentInlinePlugin,
  mathmlPlugin,
  markPlugin,
  dndPlugin,
  toolbarPlugin,
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  rephrasePlugin,
  symbolPlugin,
  unsupportedPlugin,
  pastePlugin,
];
