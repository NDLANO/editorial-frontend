/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Block } from 'slate';
import SlateBodyBox from './SlateBodyBox';
import { defaultBlock } from '../../schema';

export const defaultBodyBoxBlock = () =>
  Block.create({
    isVoid: false,
    type: 'bodybox',
    nodes: Block.createList([defaultBlock]),
  });

export default function createBodyBox() {
  const schema = {
    nodes: {
      bodybox: SlateBodyBox,
    },
  };

  return {
    schema,
  };
}
