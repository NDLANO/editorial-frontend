/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms, Range } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_COMMENT } from "./types";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { KEY_BACKSPACE } from "../../utils/keys";
import { TYPE_NDLA_EMBED } from "../embed/types";

export const commentSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource === "comment") {
      return slatejsx("element", {
        type: TYPE_COMMENT,
        data: embedAttributes,
      });
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node) || node.type !== TYPE_COMMENT || !node.data) return;
    return createEmbedTagV2(node.data, children);
  },
};

const onBackspace = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (hasNodeOfType(editor, TYPE_COMMENT)) {
    if (Range.isRange(editor.selection)) {
      // Replace heading with paragraph if last character is removed
      if (
        Range.isCollapsed(editor.selection) &&
        Editor.string(editor, editor.selection.anchor.path).length === 1 &&
        editor.selection.anchor.offset === 1
      ) {
        e.preventDefault();
        editor.deleteBackward("character");
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT,
        });
        return;
      }
    }
  }
  return nextOnKeyDown?.(e);
};

export const commentPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, onKeyDown: nextOnKeyDown } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_COMMENT) {
      return true;
    }
    return nextIsInline(element);
  };

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (!editor.selection) return nextOnKeyDown?.(e);
    if (e.key === KEY_BACKSPACE) {
      return onBackspace(e, editor, nextOnKeyDown);
    }

    nextOnKeyDown?.(e);
  };

  return editor;
};
