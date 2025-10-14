/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element } from "slate";
import { HEADING_ELEMENT_TYPE, LIST_ELEMENT_TYPE, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";

export interface BlockPickerOptions {
  allowedPickAreas: Element["type"][];
  illegalAreas: Element["type"][];
  actionsToShowInAreas: { [key: string]: string[] };
}

const defaultOptions: BlockPickerOptions = {
  allowedPickAreas: [PARAGRAPH_ELEMENT_TYPE, HEADING_ELEMENT_TYPE],
  illegalAreas: [BLOCK_QUOTE_ELEMENT_TYPE, LIST_ELEMENT_TYPE],
  actionsToShowInAreas: {},
};

export const createBlockpickerOptions = (opts: Partial<BlockPickerOptions>): BlockPickerOptions => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || defaultOptions.actionsToShowInAreas,
});
