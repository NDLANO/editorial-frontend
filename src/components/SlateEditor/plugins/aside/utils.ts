/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx } from 'slate-hyperscript';
import { AsideElement, TYPE_ASIDE } from '.';

export const defaultAsideBlock = (data?: AsideElement['data']) =>
  jsx('element', { type: TYPE_ASIDE, data: { ...data } }, [{ text: '' }]);

export const getAsideType = (el: HTMLElement): { type: string } => {
  const asideType = el.attributes.getNamedItem('data-type')?.value;
  return {
    type: asideType ?? 'rightAside',
  };
};
