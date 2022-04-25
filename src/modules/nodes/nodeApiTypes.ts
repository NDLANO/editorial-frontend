/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TaxonomyMetadata } from '../taxonomy/taxonomyApiInterfaces';

export const SUBJECT_NODE = 'SUBJECT';
export const NODE = 'NODE';
export const TOPIC_NODE = 'TOPIC';

export type NodeTypeValue = typeof SUBJECT_NODE | typeof NODE | typeof TOPIC_NODE;

export interface GetNodeParams {
  contentURI?: string;
  isRoot?: boolean;
  key?: string;
  language?: string;
  nodeType?: NodeTypeValue;
  value?: string;
}

export interface NodeTranslation {
  language: string;
  name: string;
}

export interface NodeTranslationPutType {
  name: string;
}

export interface GetChildNodesParams {
  language?: string;
  recursive?: boolean;
}

export interface GetNodeResourcesParams {
  language?: string;
  recursive?: boolean;
  relevance?: string;
  type?: string;
}

export interface NodeType {
  contentUri?: string;
  id: string;
  metadata: TaxonomyMetadata;
  name: string;
  path: string;
  paths?: string[];
  relevanceId?: string;
  translations: NodeTranslation[];
  supportedLanguages: string[];
}

export interface ResourceWithNodeConnection {
  connectionId: string;
  contentUri?: string;
  id: string;
  metadata: TaxonomyMetadata;
  name: string;
  nodeId: string;
  path: string;
  parentId?: string;
  paths: string[];
  primary: boolean;
  rank: number;
  relevanceId: string;
  translations: NodeTranslation[];
  supportedLanguages: string[];
  resourceTypes: {
    id: string;
    name: string;
    parentId?: string;
  }[];
}

export interface ChildNodeType extends NodeType {
  connectionId: string;
  isPrimary: boolean;
  primary: boolean;
  rank: number;
  childNodes?: ChildNodeType[];
  parent: string;
}

export interface NodePostPatchType {
  contentUri?: string;
  id?: string;
  name: string;
  nodeId?: string;
  nodeType: NodeTypeValue;
  root?: boolean;
}

export interface ConnectionForNode {
  connectionId: string;
  isPrimary: boolean;
  paths: string[];
  primary: boolean;
  targetId: string;
  type: string;
}

export interface NodeConnectionPostType {
  childId: string;
  parentId: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export interface NodeConnectionPutType {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export interface NodeResourcePostType {
  nodeId: string;
  resourceId: string;
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}

export interface NodeResourcePutType {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
}
