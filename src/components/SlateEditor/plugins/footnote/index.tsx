/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms, Range } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_FOOTNOTE } from "./types";
import { reduceElementDataAttributes, createEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { KEY_BACKSPACE, KEY_DELETE } from "../../utils/keys";
import { TYPE_NDLA_EMBED } from "../embed/types";

export interface FootnoteElement {
  type: "footnote";
  data: {
    authors: string[];
    title: string;
    year: string;
    resource: string;
    edition: string;
    publisher: string;
    type?: string;
  };
  children: Descendant[];
}

export const footnoteSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== "footnote") return;
    return slatejsx(
      "element",
      {
        type: TYPE_FOOTNOTE,
        data: {
          ...embedAttributes,
          authors: embedAttributes.authors ? embedAttributes.authors.split(";") : [],
        },
      },
      [{ text: "[#]" }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_FOOTNOTE) return;
    const data = {
      ...node.data,
      authors: node.data.authors ? node.data.authors.join(";") : "",
    };

    return createEmbedTag(data, undefined);
  },
};

export const footnotePlugin = (editor: Editor) => {
  const { isInline: nextIsInline, isVoid: nextIsVoid, onKeyDown: nextOnKeyDown } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_FOOTNOTE) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_FOOTNOTE) {
      return true;
    }
    return nextIsVoid(element);
  };

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_BACKSPACE || e.key === KEY_DELETE) {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        const entry = getCurrentBlock(editor, TYPE_FOOTNOTE);
        if (!entry) {
          return nextOnKeyDown && nextOnKeyDown(e);
        }
        const [currentBlock, currentPath] = entry;

        if (Element.isElement(currentBlock) && currentBlock.type === "footnote") {
          e.preventDefault();
          Transforms.removeNodes(editor, {
            at: currentPath,
          });
          return;
        }
      }
    }
    nextOnKeyDown && nextOnKeyDown(e);
  };

  return editor;
};
