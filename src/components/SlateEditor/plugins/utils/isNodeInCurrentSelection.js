/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const isNodeInCurrentSelection = (value, node) =>
  value.inlines.find(inline => inline.key === node.key) !== undefined;

export default isNodeInCurrentSelection;
