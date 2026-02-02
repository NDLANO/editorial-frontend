/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, getCurrentBlock } from "@ndla/editor";
import { isKeyHotkey } from "is-hotkey";
import { Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { KEY_ARROW_UP } from "../../utils/keys";
import { MATH_ELEMENT_TYPE, MATH_PLUGIN } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";

export const mathmlPlugin = createPlugin({
  name: MATH_PLUGIN,
  type: MATH_ELEMENT_TYPE,
  isInline: true,
  isVoid: true,
  shortcuts: {
    mathOnEnter: {
      keyCondition: isKeyHotkey("enter"),
      handler: (editor, event) => {
        if (!editor.selection) return false;
        const [match] = editor.nodes({ match: isMathElement });
        if (!match) return false;
        event.preventDefault();
        const domNode = ReactEditor.toDOMNode(editor, match[0]).querySelector("[data-trigger]") as
          | HTMLElement
          | undefined;
        domNode?.click();

        return true;
      },
    },
    // for some reason, chromium-based browsers scrolls the document when pressing arrow up/down. So we override it
    mathOnLineNavigation: {
      keyCondition: isKeyHotkey(["down", "up"]),
      handler: (editor, event) => {
        if (!editor.selection || !Range.isCollapsed(editor.selection)) {
          return false;
        }

        const mathml = getCurrentBlock(editor, MATH_ELEMENT_TYPE)?.[0];

        if (isMathElement(mathml)) {
          event.preventDefault();
          Transforms.move(editor, { unit: "line", reverse: event.key === KEY_ARROW_UP });
          return true;
        }
        return false;
      },
    },
  },
});
