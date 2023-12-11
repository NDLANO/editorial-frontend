/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Element } from 'slate';
import { TYPE_LIST } from '../types';

export const isList = (el: Element): boolean => {
  return el.type === TYPE_LIST;
};
