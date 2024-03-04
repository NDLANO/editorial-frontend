/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ParagraphElement } from ".";
import { TYPE_PARAGRAPH } from "./types";

export const defaultParagraphBlock = () =>
  slatejsx("element", { type: TYPE_PARAGRAPH }, { text: "" }) as ParagraphElement;

export const isParagraph = (node: Node | undefined): node is ParagraphElement => {
  return Element.isElement(node) && node.type === TYPE_PARAGRAPH;
};
