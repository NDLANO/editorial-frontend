/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isKeyHotkey } from "is-hotkey";
import { Descendant, Editor, Element, Node, Range, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ConceptInlineElement } from "./interfaces";
import { TYPE_CONCEPT_INLINE } from "./types";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { KEY_ARROW_LEFT, KEY_ARROW_RIGHT, KEY_BACKSPACE, KEY_ENTER } from "../../../utils/keys";
import { TYPE_NDLA_EMBED } from "../../embed/types";

export const inlineConceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource === "concept" && embedAttributes.type === "inline") {
      return slatejsx(
        "element",
        {
          type: TYPE_CONCEPT_INLINE,
          data: embedAttributes,
        },
        [
          {
            text: embedAttributes.linkText ? embedAttributes.linkText : "Ukjent forklaringstekst",
          },
        ],
      );
    }
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_CONCEPT_INLINE) return;

    const data = {
      ...node.data,
      linkText: Node.string(node),
    };

    return createEmbedTagV2(data);
  },
};

const onBackspace = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (hasNodeOfType(editor, TYPE_CONCEPT_INLINE)) {
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
          match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
        });
        return;
      }
    }
  }
  return nextOnKeyDown?.(e);
};

export const inlineConceptPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, onKeyDown: nextOnKeyDown } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_CONCEPT_INLINE) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (!editor.selection) return nextOnKeyDown?.(e);
    const [entry] = Editor.nodes<ConceptInlineElement>(editor, {
      match: (node) => Element.isElement(node) && node.type === "concept-inline",
      at: editor.selection,
      mode: "lowest",
    });
    if (e.key === KEY_BACKSPACE) {
      return onBackspace(e, editor, nextOnKeyDown);
    }

    if ((e.key === KEY_ARROW_RIGHT || e.key === KEY_ARROW_LEFT) && entry) {
      const reverse = isKeyHotkey("left", e);
      // Link block is focused until editor-selection is at the start or end of the link block,
      // so we need to force move the cursor to the next block by jumping 2 offsets when 1 step
      // before the start or end of the link block.
      if (isKeyHotkey("left", e) || isKeyHotkey("right", e)) {
        e.preventDefault();
        Transforms.move(editor, {
          unit: "offset",
          reverse,
          distance: 1,
        });
        return;
      }
    }
    if (e.key === KEY_ENTER && entry) {
      e.preventDefault();
      return;
    }

    nextOnKeyDown?.(e);
  };

  return editor;
};
