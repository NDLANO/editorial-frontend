/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, Descendant } from "slate";

export const Plain = {
  serialize: (nodes: Descendant[]) => {
    return nodes.map((n) => Node.string(n)).join("\n");
  },
  deserialize: (text: string): Descendant[] => {
    return text.split("\n").map((t) => ({
      type: "paragraph",
      children: [{ text: t }],
    }));
  },
};
