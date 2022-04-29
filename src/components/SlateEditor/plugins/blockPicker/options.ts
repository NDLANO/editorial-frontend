import { Element } from 'slate';
import { TYPE_QUOTE } from '../blockquote/types';
import { TYPE_HEADING } from '../heading/types';
import { TYPE_LIST } from '../list/types';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_TABLE } from '../table/types';

export interface BlockPickerOptions {
  allowedPickAreas: Element['type'][];
  illegalAreas: Element['type'][];
  actionsToShowInAreas: { [key: string]: string[] };
}

const defaultOptions: BlockPickerOptions = {
  allowedPickAreas: [TYPE_PARAGRAPH, TYPE_HEADING],
  illegalAreas: [TYPE_QUOTE, TYPE_TABLE, TYPE_LIST],
  actionsToShowInAreas: {},
};

export const createBlockpickerOptions = (
  opts: Partial<BlockPickerOptions>,
): BlockPickerOptions => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || defaultOptions.actionsToShowInAreas,
});
