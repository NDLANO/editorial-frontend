/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { editTablePlugin } from '../externalPlugins';

const hasNodeOfType = (value, type, kind = 'block') => {
  if (type === 'table') {
    return editTablePlugin.utils.isSelectionInTable(value);
  }
  return value[`${kind}s`].some(node => node.type === type);
};

export default hasNodeOfType;
