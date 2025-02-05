/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { PARAGRAPH_ELEMENT_TYPE, ParagraphElement } from "@ndla/editor";

// TODO: This shouldn't need to be casted
export const defaultParagraphBlock = () =>
  slatejsx("element", { type: PARAGRAPH_ELEMENT_TYPE }, { text: "" }) as ParagraphElement;

// TODO: This should be replaced with the one in frontend-packages
export const isParagraph = (node: Node | undefined): node is ParagraphElement => {
  return Element.isElement(node) && node.type === PARAGRAPH_ELEMENT_TYPE;
};
