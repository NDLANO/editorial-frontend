/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Element } from "slate";
import { TYPE_HEADING } from "../heading/types";
import { TYPE_LIST } from "../list/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "../blockquote/blockquoteTypes";

export interface BlockPickerOptions {
  allowedPickAreas: Element["type"][];
  illegalAreas: Element["type"][];
  actionsToShowInAreas: { [key: string]: string[] };
}

const defaultOptions: BlockPickerOptions = {
  allowedPickAreas: [TYPE_PARAGRAPH, TYPE_HEADING],
  illegalAreas: [BLOCK_QUOTE_ELEMENT_TYPE, TYPE_LIST],
  actionsToShowInAreas: {},
};

export const createBlockpickerOptions = (opts: Partial<BlockPickerOptions>): BlockPickerOptions => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || defaultOptions.actionsToShowInAreas,
});
