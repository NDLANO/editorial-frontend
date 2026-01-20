/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, NodeChild, NodeConnectionType, NodeType } from "@ndla/types-taxonomy";

export const PROGRAMME = "PROGRAMME";
export const SUBJECT_NODE = "SUBJECT";
export const NODE = "NODE";
export const TOPIC_NODE = "TOPIC";
export const RESOURCE_NODE = "RESOURCE";

export interface GetNodesParams {
  contentURI?: string;
  isRoot?: boolean;
  isContext?: boolean;
  key?: string;
  language?: string;
  nodeType?: NodeType[];
  value?: string;
  contextId?: string;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
}

export interface GetChildNodesParams {
  id: string;
  language?: string;
  nodeType?: NodeType[];
  recursive?: boolean;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
  isVisible?: boolean;
  connectionTypes?: NodeConnectionType[];
}

export interface GetNodeResourcesParams {
  language?: string;
  recursive?: boolean;
  relevance?: string;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
  isVisible?: boolean;
}

export interface NodeWithChildren extends Node {
  childNodes?: NodeChildWithChildren[];
}

export interface NodeChildWithChildren extends NodeChild {
  childNodes?: NodeChildWithChildren[];
}
