/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import { schema, renderBlock, normalizeNode } from './schema';

export default function createTablePlugin() {
  return {
    schema,
    renderBlock,
    normalizeNode,
  };
}
