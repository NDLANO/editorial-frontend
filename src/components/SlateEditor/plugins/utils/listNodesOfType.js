/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const listNodesOfType = (state, type) => {
  const { document } = state;

  return document.filterDescendants(node => node.type === type);
};

export default listNodesOfType;
