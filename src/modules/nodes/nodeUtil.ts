/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NODE, NodeType, NodeTypeValue, SUBJECT_NODE, TOPIC_NODE } from './nodeApiTypes';

const validNodeTypes: NodeTypeValue[] = [SUBJECT_NODE, TOPIC_NODE, NODE];
export const getNodeTypeFromNodeId = (id: string): NodeTypeValue => {
  const idType = id.split(':')[1].toUpperCase();
  return validNodeTypes.find(t => t === idType) ?? NODE;
};

export const isRootNode = (node: NodeType): boolean => {
  return node.id.replace('urn:', '/') === node.path;
};

export const getRootIdForNode = (node: NodeType): string => {
  return `urn:${node.path.substring(1).split('/')[0]}`;
};
