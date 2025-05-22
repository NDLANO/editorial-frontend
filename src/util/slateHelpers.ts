/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Node, Element, ElementType } from "slate";

export const findNodesByType = <T extends ElementType>(
  descendants: Descendant[],
  ...types: readonly T[]
): Extract<Element, { type: T }>[] => {
  return descendants
    .flatMap((descendant) => Array.from(Node.elements(descendant)))
    .map(([node]) => node)
    .filter((node): node is Extract<Element, { type: T }> => types.includes(node.type as T));
};
