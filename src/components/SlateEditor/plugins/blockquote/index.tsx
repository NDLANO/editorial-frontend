/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";
import { Descendant, Editor, Element, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_QUOTE } from "./types";
import { createTag, reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { KEY_ENTER } from "../../utils/keys";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface BlockQuoteElement {
  type: "quote";
  children: Descendant[];
  data?: {
    variant: "neutral" | "colored";
  };
}

export const blockQuoteSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "blockquote") return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    return slatejsx(
      "element",
      { type: TYPE_QUOTE, data: Object.keys(embedAttributes).length ? embedAttributes : undefined },
      children,
    );
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_QUOTE) {
      return createTag("blockquote", node.data, children, { bailOnEmptyData: false }, undefined);
    }
  },
};

const onEnter = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  const entry = getCurrentBlock(editor, TYPE_QUOTE);
  if (!entry) {
    return nextOnKeyDown && nextOnKeyDown(e);
  }
  const [quoteNode, quotePath] = entry;

  if (!quoteNode || !(editor.selection && editor.selection)) {
    if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
    return;
  }

  e.preventDefault();

  if (e.shiftKey === true) {
    return editor.insertText("\n");
  }

  if (Editor.string(editor, editor.selection.anchor.path) === "") {
    const quoteChildPath = editor.selection.anchor.path.slice(0, quotePath.length + 1);

    return Transforms.liftNodes(editor, {
      at: quoteChildPath,
    });
  }

  return editor.insertNode(slatejsx("element", { type: TYPE_PARAGRAPH }, [{ text: "" }]));
};

export const blockQuotePlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
