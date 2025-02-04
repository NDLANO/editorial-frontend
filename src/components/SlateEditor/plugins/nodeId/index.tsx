/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { nanoid } from "nanoid";
import { Editor, Element, Node, Path, Transforms } from "slate";
import { TYPE_BREAK } from "../break/types";
import { TYPE_SECTION } from "../section/types";

const makeNodeId = () => nanoid(16);

const assignIdRecursively = (editor: Editor, node: Node, path: Path) => {
  if (Element.isElement(node)) {
    if (!node.id) {
      Transforms.setNodes(editor, { id: makeNodeId() }, { at: path });
    }

    for (const [childNode, childPath] of Node.children(editor, path)) {
      assignIdRecursively(editor, childNode, childPath);
    }
  }
};

export const nodeIdPlugin = (editor: Editor) => {
  const { apply, normalizeNode: nextNormalizeNode } = editor;

  editor.apply = (operation) => {
    if (operation.type === "split_node") {
      const id = makeNodeId();
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: id,
        },
      });
    }

    return apply(operation);
  };

  //  TODO: Could this be done in a more efficient way?
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && editor.isBlock(node) && node.type !== TYPE_SECTION && node.type !== TYPE_BREAK) {
      assignIdRecursively(editor, node, path);
    }

    return nextNormalizeNode(entry);
  };

  return editor;
};
