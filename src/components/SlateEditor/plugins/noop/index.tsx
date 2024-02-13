/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_NOOP } from "./types";
import { SlateSerializer } from "../../interfaces";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface NoopElement {
  type: "noop";
  children: Descendant[];
}

export const noopSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.attributes.getNamedItem("data-noop")?.value === "true") {
      return slatejsx("element", { type: TYPE_NOOP }, children);
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node) || node.type !== TYPE_NOOP) return;
    return <>{children}</>;
  },
};

export const noopPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, onKeyDown: nextOnKeyDown } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    // If the noop only contains a single paragraph, unwrap it and save it as plain text instead
    if (
      Element.isElement(node) &&
      node.type === TYPE_NOOP &&
      node.children.length === 1 &&
      Element.isElement(node.children[0]) &&
      node.children[0].type === TYPE_PARAGRAPH
    ) {
      Transforms.unwrapNodes(editor, { match: (node) => Element.isElement(node) && node.type === TYPE_PARAGRAPH });
      return;
    }
    return nextNormalizeNode(entry);
  };

  editor.onKeyDown = (e) => {
    if (e.key !== "Enter") return nextOnKeyDown?.(e);
    const [match] = Editor.nodes(editor, {
      match: (node) =>
        Element.isElement(node) && node.type === "noop" && node.children.every((child) => !Element.isElement(child)),
    });
    if (!match) return nextOnKeyDown?.(e);
    Transforms.setNodes(editor, { type: "paragraph" });
  };

  return editor;
};
