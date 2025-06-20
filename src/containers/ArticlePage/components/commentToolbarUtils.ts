/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SlatePlugin } from "../../../components/SlateEditor/interfaces";
import { breakRenderer } from "../../../components/SlateEditor/plugins/break/render";
import { contentLinkPlugin, linkPlugin } from "../../../components/SlateEditor/plugins/link";
import { linkRenderer } from "../../../components/SlateEditor/plugins/link/render";
import { listRenderer } from "../../../components/SlateEditor/plugins/list/render";
import { markRenderer } from "../../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../../components/SlateEditor/plugins/noop/render";
import { paragraphRenderer } from "../../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../../components/SlateEditor/plugins/saveHotkey";
import { sectionPlugin } from "../../../components/SlateEditor/plugins/section";
import { sectionRenderer } from "../../../components/SlateEditor/plugins/section/render";
import { spanPlugin } from "../../../components/SlateEditor/plugins/span";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../components/SlateEditor/plugins/toolbar";
import { paragraphPlugin } from "../../../components/SlateEditor/plugins/paragraph";
import { breakPlugin } from "../../../components/SlateEditor/plugins/break";
import { markPlugin } from "../../../components/SlateEditor/plugins/mark";
import { listPlugin } from "../../../components/SlateEditor/plugins/list";
import { inlineNavigationPlugin } from "@ndla/editor";
import { divRenderer } from "../../../components/SlateEditor/plugins/div/render";
import { divPlugin } from "../../../components/SlateEditor/plugins/div";
import { unsupportedPlugin } from "../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import { unsupportedElementRenderer } from "../../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { pastePlugin } from "../../../components/SlateEditor/plugins/paste";

export const plugins: SlatePlugin[] = [
  inlineNavigationPlugin,
  sectionPlugin,
  spanPlugin,
  paragraphPlugin,
  divPlugin,
  toolbarPlugin.configure({
    options: {
      options: {
        text: { hidden: true },
        languages: { hidden: true },
        block: { hidden: true, "bulleted-list": { hidden: false } },
        inline: {
          hidden: true,
          "content-link": { hidden: false },
        },
      },
    },
  }),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin.configure({
    options: { supportedMarks: { value: ["bold", "italic"], override: true } },
  }),
  noopPlugin,
  contentLinkPlugin,
  linkPlugin,
  listPlugin,
  unsupportedPlugin,
  pastePlugin,
  sectionRenderer,
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  linkRenderer,
  listRenderer,
  divRenderer,
  unsupportedElementRenderer,
];
