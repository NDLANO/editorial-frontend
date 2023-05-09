import { jsx as slatejsx } from 'slate-hyperscript';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TYPE_GRID } from './types';

export const defaultGridBlock = () => {
  return slatejsx(
    'element',
    {
      type: TYPE_GRID,
      data: { size: 'small', columns: 2 },
      isFirstEdit: true,
    },
    defaultParagraphBlock(),
  );
};
