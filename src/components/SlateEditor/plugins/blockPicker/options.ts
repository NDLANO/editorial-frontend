import { Element } from 'slate';
import { TYPE_QUOTE } from '../blockquote';
import { TYPE_HEADING } from '../heading';
import { TYPE_LIST } from '../list/types';
import { TYPE_PARAGRAPH } from '../paragraph/utils';
import { TYPE_TABLE } from '../table/utils';

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

const options = (opts: Partial<BlockPickerOptions>): BlockPickerOptions => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || defaultOptions.actionsToShowInAreas,
});

export default options;
