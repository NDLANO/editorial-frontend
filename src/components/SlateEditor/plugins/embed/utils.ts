/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { Element, Node } from 'slate';
import { EmbedElement } from '.';
import { Embed } from '../../../../interfaces';
import { TYPE_EMBED } from './types';

export const defaultEmbedBlock = (data: Partial<Embed>) => {
  return slatejsx('element', { type: TYPE_EMBED, data }, { text: '' });
};

export const isEmbed = (node: Node): node is EmbedElement => {
  return Element.isElement(node) && node.type === 'embed';
};
