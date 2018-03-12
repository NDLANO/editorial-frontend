/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isTypeinSelection from './isTypeinSelection';
import listNodesOfType from './listNodesOfType';
import hasNodeOfType from './hasNodeOfType';

export { isTypeinSelection, listNodesOfType, hasNodeOfType };

export const checkSelctionForType = (type, value, nodeKey) => {
  const parent = value.document.getParent(nodeKey);
  if (
    !parent ||
    parent.get('type') === 'section' ||
    parent.get('type') === 'document'
  ) {
    return false;
  }
  if (parent.get('type') === type) {
    return true;
  }
  const key = parent.key;
  return checkSelctionForType(type, value, key);
};
