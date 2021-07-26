/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Node } from 'slate';

export const findNodesByType = (descendants: Descendant[], type: string) => {
  const ret = descendants
    .flatMap(descendant => Array.from(Node.elements(descendant)))
    .map(([node]) => node)
    .filter(node => node.type === type);
  return ret;
};
