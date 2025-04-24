/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { isElementOfType } from "@ndla/editor";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "./types";

export const isTableElement = (node: Node | undefined) => isElementOfType(node, TABLE_ELEMENT_TYPE);

export const isTableCaptionElement = (node: Node | undefined) => isElementOfType(node, TABLE_CAPTION_ELEMENT_TYPE);

export const isTableHeadElement = (node: Node | undefined) => isElementOfType(node, TABLE_HEAD_ELEMENT_TYPE);

export const isTableBodyElement = (node: Node | undefined) => isElementOfType(node, TABLE_BODY_ELEMENT_TYPE);

export const isTableRowElement = (node: Node | undefined) => isElementOfType(node, TABLE_ROW_ELEMENT_TYPE);

export const isTableCellElement = (node: Node | undefined) => isElementOfType(node, TABLE_CELL_ELEMENT_TYPE);

export const isTableCellHeaderElement = (node: Node | undefined) =>
  isElementOfType(node, TABLE_CELL_HEADER_ELEMENT_TYPE);

export const isTableBodyOrHeadElement = (node: Node | undefined) =>
  isElementOfType(node, [TABLE_HEAD_ELEMENT_TYPE, TABLE_BODY_ELEMENT_TYPE]);

export const isAnyTableCellElement = (node: Node | undefined) =>
  isElementOfType(node, [TABLE_CELL_ELEMENT_TYPE, TABLE_CELL_HEADER_ELEMENT_TYPE]);
