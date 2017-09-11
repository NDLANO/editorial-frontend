/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const hasNodeOfType = (state, type, kind = 'block') =>
  state[`${kind}s`].some(node => node.type === type);

export default hasNodeOfType;
