/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin } from "@ndla/editor";
import { Descendant, Editor, Element, Node, NodeEntry } from "slate";
import { makeNodeId } from "../../utils/makeNodeId";
import { ID_PLUGIN } from "./idTypes";

const assignIdToInitialValue = (editor: Editor, idsSet: Set<string>, nodeEntry: NodeEntry) => {
  const [node, path] = nodeEntry;
  if (Node.isElement(node) && editor.isBlock(node)) {
    if (!node.id && editor.hasPath(path)) {
      let nodeId = makeNodeId();
      while (idsSet.has(nodeId)) {
        nodeId = makeNodeId();
      }
      node.id = nodeId;
    }
    node.children.forEach((node, idx) => assignIdToInitialValue(editor, idsSet, [node, path.concat(idx)]));
  }
};

const getAllIds = (children: Descendant[], set = new Set<string>()): Set<string> => {
  children.forEach((node) => {
    if ("id" in node && node.id) {
      set.add(node.id);
      node.children?.forEach((child) => getAllIds([child], set));
    }
  });
  return set;
};

const isBlockType = (editor: Editor, node: Partial<Node>): node is Partial<Element> =>
  "type" in node && !!node.type && editor.isBlock({ type: node.type, children: [] } as Element);

const TRANSFORM_OPS = ["insert_node", "remove_node", "merge_node", "split_node"];

export const idPlugin = createPlugin({
  name: ID_PLUGIN,
  normalizeInitialValue: (editor) => {
    const idsSet = new Set<string>();
    editor.children.forEach((node, idx) => assignIdToInitialValue(editor, idsSet, [node, [idx]]));
  },
  transform: (editor) => {
    let idsSet = new Set<string>();
    const { apply } = editor;

    const assignIdRecursively = (node: Node) => {
      if (Node.isElement(node) && editor.isBlock(node)) {
        if (!node.id || idsSet.has(node.id)) {
          let nodeId = makeNodeId();
          while (idsSet.has(nodeId)) {
            nodeId = makeNodeId();
          }
          idsSet.add(nodeId);
          node.id = nodeId;
        }
        node.children.forEach(assignIdRecursively);
      }
    };

    editor.apply = (operation) => {
      // If there are no ids in the document and our history is empty, the editor is clean. We need to add the initial ids
      if (
        (!idsSet.size && (!editor.history.redos.length || !editor.history.undos.length)) ||
        TRANSFORM_OPS.includes(operation.type)
      ) {
        idsSet = getAllIds(editor.children);
      }
      if (operation.type === "remove_node") {
        if ("id" in operation.node && operation.node.id) {
          idsSet.delete(operation.node.id);
        }
      } else if (operation.type === "merge_node") {
        if ("id" in operation.properties && operation.properties.id) {
          idsSet.delete(operation.properties.id);
        }
      } else if (operation.type === "insert_node") {
        assignIdRecursively(operation.node);
      } else if (operation.type === "split_node" && isBlockType(editor, operation.properties)) {
        let nodeId = makeNodeId();
        while (idsSet.has(nodeId)) {
          nodeId = makeNodeId();
        }
        idsSet.add(nodeId);
        operation.properties.id = nodeId;
      }

      return apply(operation);
    };

    return editor;
  },
});
