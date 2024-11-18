/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, NodeType } from "@ndla/types-taxonomy";
import { NODE, PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from "./nodeApiTypes";

const validNodeTypes: NodeType[] = [PROGRAMME, SUBJECT_NODE, TOPIC_NODE, NODE];
export const getNodeTypeFromNodeId = (id: string): NodeType => {
  const idType = id.split(":")[1].toUpperCase();
  return validNodeTypes.find((t) => t === idType) ?? NODE;
};

export const isRootNode = (node: Node): boolean => {
  return node.id.replace("urn:", "/") === node.path;
};

export const getRootIdForNode = (node: Node): string => {
  return `urn:${node.path?.substring(1).split("/")[0]}`;
};
