/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_ASIDE } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';

export const defaultAsideBlock = (type?: string) =>
  slatejsx('element', { type: TYPE_ASIDE, data: { type } }, defaultParagraphBlock());

export const getAsideType = (el: HTMLElement): { type: string } => {
  const asideType = el.attributes.getNamedItem('data-type')?.value;
  return {
    type: asideType ?? 'rightAside',
  };
};
