import { TYPE_QUOTE } from '../blockquote';
import { TYPE_HEADING } from '../heading';
import { TYPE_LIST } from '../list/types';
import { TYPE_PARAGRAPH } from '../paragraph/utils';
import { TYPE_TABLE } from '../table/utils';

const defaultOptions = {
  allowedPickAreas: [TYPE_PARAGRAPH, TYPE_HEADING],
  illegalAreas: [TYPE_QUOTE, TYPE_TABLE, TYPE_LIST],
};

const options = opts => ({
  allowedPickAreas: opts.allowedPickAreas || defaultOptions.allowedPickAreas,
  illegalAreas: opts.illegalAreas || defaultOptions.illegalAreas,
  actionsToShowInAreas: opts.actionsToShowInAreas || undefined,
});

export default options;
