/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ICommentDTO, IEditorNoteDTO, IResponsibleDTO, IRevisionMetaDTO } from "@ndla/types-backend/draft-api";
import { Node, NodeChild, NodeType } from "@ndla/types-taxonomy";

export const PROGRAMME = "PROGRAMME";
export const SUBJECT_NODE = "SUBJECT";
export const NODE = "NODE";
export const TOPIC_NODE = "TOPIC";
export const RESOURCE_NODE = "RESOURCE";

export interface GetNodeParams {
  contentURI?: string;
  isRoot?: boolean;
  isContext?: boolean;
  key?: string;
  language?: string;
  nodeType?: NodeType;
  value?: string;
  contextId?: string;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
}

export interface GetChildNodesParams {
  language?: string;
  nodeType?: NodeType[];
  recursive?: boolean;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
  isVisible?: boolean;
}

export interface GetNodeResourcesParams {
  language?: string;
  recursive?: boolean;
  relevance?: string;
  type?: string;
  includeContexts?: boolean;
  filterProgrammes?: boolean;
  isVisible?: boolean;
}

export interface NodeResourceMeta {
  contentUri: string;
  grepCodes?: string[];
  status?: { current: string; other: string[] };
  articleType?: string;
  revision?: number;
  notes?: IEditorNoteDTO[];
  revisions?: IRevisionMetaDTO[];
  responsible?: IResponsibleDTO;
  started?: boolean;
  comments?: ICommentDTO[];
}

export interface ResourceWithNodeConnectionAndMeta extends NodeChild {
  contentMeta?: NodeResourceMeta;
}

export interface NodeWithChildren extends Node {
  childNodes?: NodeChildWithChildren[];
}

export interface NodeChildWithChildren extends NodeChild {
  childNodes?: NodeChildWithChildren[];
}
