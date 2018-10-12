/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const isTypeinSelection = (value, type, edge = 'anchor') =>
  value[`${edge}Block`].type === type;

export default isTypeinSelection;
