/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block } from 'slate';
import { defaultBlock } from '../../schema';
import SlateAside from './SlateAside';

export const defaultAsideBlock = type =>
  Block.create({
    data: { type },
    isVoid: false,
    type: 'aside',
    nodes: Block.createList([defaultBlock]),
  });

export default function createAside() {
  const schema = {
    nodes: {
      aside: SlateAside,
    },
  };

  return {
    schema,
  };
}
