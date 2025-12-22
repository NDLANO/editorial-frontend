/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  openapi,
  Node,
  NodePostPut,
  NodeChild,
  Translation,
  TranslationPUT,
  NodeConnectionPUT,
  NodeConnectionPOST,
  NodeResourcePOST,
  NodeResourcePUT,
  NodeType,
  Connection,
  Metadata,
  MetadataPUT,
  NodeSearchBody,
} from "@ndla/types-taxonomy";
import { GetChildNodesParams, GetNodesParams, GetNodeResourcesParams } from "./nodeApiTypes";
import { SearchResultBase, WithTaxonomyVersion } from "../../interfaces";
import { createAuthClient } from "../../util/apiHelpers";
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
  resolveJsonOATS,
} from "../../util/resolveJsonOrRejectWithError";

const client = createAuthClient<openapi.paths>("/taxonomy");

interface NodeGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const fetchNode = (params: NodeGetParams): Promise<Node> =>
  client
    .GET("/v1/nodes/{id}", {
      params: {
        path: { id: params.id },
        query: {
          language: params.language,
        },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodesGetParams extends WithTaxonomyVersion, GetNodesParams {}

export const fetchNodes = (params: NodesGetParams): Promise<Node[]> =>
  client
    .GET("/v1/nodes", {
      params: {
        query: params,
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodePostParams extends WithTaxonomyVersion {
  body: NodePostPut;
}

export const postNode = (params: NodePostParams): Promise<string> =>
  client
    .POST("/v1/nodes", {
      body: params.body,
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveLocation(response.response));

interface ConnectionsForNodeGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchConnectionsForNode = (params: ConnectionsForNodeGetParams): Promise<Connection[]> =>
  client
    .GET("/v1/nodes/{id}/connections", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodeDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteNode = (params: NodeDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/nodes/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface NodeMetadataPutParams extends WithTaxonomyVersion {
  id: string;
  meta: MetadataPUT;
}

export const putNodeMetadata = (params: NodeMetadataPutParams): Promise<Metadata> =>
  client
    .PUT("/v1/nodes/{id}/metadata", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.meta,
    })
    .then((response) => resolveJsonOATS(response));

interface ChildNodesGetParams extends WithTaxonomyVersion, GetChildNodesParams {
  id: string;
}

export const fetchChildNodes = (params: ChildNodesGetParams): Promise<NodeChild[]> =>
  client
    .GET("/v1/nodes/{id}/nodes", {
      params: {
        path: { id: params.id },
        query: {
          recursive: params.recursive,
          nodeType: params.nodeType,
          language: params.language,
          includeContexts: params.includeContexts,
          filterProgrammes: params.filterProgrammes,
          isVisible: params.isVisible,
          connectionTypes: params.connectionTypes,
        },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodeTranslationsGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchNodeTranslations = (params: NodeTranslationsGetParams): Promise<Translation[]> =>
  client
    .GET("/v1/nodes/{id}/translations", {
      params: {
        path: { id: params.id },
        headers: {
          VersionHash: params.taxonomyVersion,
        },
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodeTranslationDeleteParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const deleteNodeTranslation = (params: NodeTranslationDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/nodes/{id}/translations/{language}", {
      params: {
        path: { id: params.id, language: params.language },
        headers: {
          VersionHash: params.taxonomyVersion,
        },
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodeTranslationPutParams extends WithTaxonomyVersion {
  id: string;
  language: string;
  body: TranslationPUT;
}

export const putNodeTranslation = (params: NodeTranslationPutParams): Promise<void> =>
  client
    .PUT("/v1/nodes/{id}/translations/{language}", {
      params: {
        path: { id: params.id, language: params.language },
        headers: {
          VersionHash: params.taxonomyVersion,
        },
      },
      body: params.body,
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface NodeResourcesGetParams extends WithTaxonomyVersion, GetNodeResourcesParams {
  id: string;
}

export const fetchNodeResources = (params: NodeResourcesGetParams): Promise<NodeChild[]> =>
  client
    .GET("/v1/nodes/{id}/resources", {
      params: {
        path: { id: params.id },
        query: {
          language: params.language,
          recursive: params.recursive,
          relevance: params.relevance,
          includeContexts: params.includeContexts,
          filterProgrammes: params.filterProgrammes,
          isVisible: params.isVisible,
        },
        headers: {
          VersionHash: params.taxonomyVersion,
        },
      },
    })
    .then((response) => resolveJsonOATS(response));

interface NodeConnectionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteNodeConnection = (params: NodeConnectionDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/node-connections/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface NodeConnectionPutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeConnectionPUT;
}

export const putNodeConnection = (params: NodeConnectionPutParams): Promise<void> =>
  client
    .PUT("/v1/node-connections/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface NodeConnectionPostParams extends WithTaxonomyVersion {
  body: NodeConnectionPOST;
}

export const postNodeConnection = (params: NodeConnectionPostParams): Promise<string> =>
  client
    .POST("/v1/node-connections", {
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveLocation(response.response));

interface NodeResourcePostParams extends WithTaxonomyVersion {
  body: NodeResourcePOST;
}

export const postResourceForNode = (params: NodeResourcePostParams) =>
  client
    .POST("/v1/node-resources", {
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveLocation(response.response));

interface NodeResourceDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteResourceForNode = (params: NodeResourceDeleteParams): Promise<void> =>
  client
    .DELETE("/v1/node-resources/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface NodeResourcePutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeResourcePUT;
}

export const putResourceForNode = (params: NodeResourcePutParams): Promise<void> =>
  client
    .PUT("/v1/node-resources/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

interface SearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: NodeType[];
  page?: number;
  pageSize?: number;
  query?: string;
}

export const searchNodes = (params: SearchNodes): Promise<SearchResultBase<Node>> =>
  client
    .GET("/v1/nodes/search", {
      params: {
        query: {
          ids: params.ids,
          language: params.language,
          nodeType: params.nodeType,
          page: params.page,
          pageSize: params.pageSize,
          query: params.query,
        },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

interface PostSearchNodes extends WithTaxonomyVersion {
  body: NodeSearchBody;
}

export const postSearchNodes = (params: PostSearchNodes): Promise<SearchResultBase<Node>> =>
  client
    .POST("/v1/nodes/search", {
      body: params.body,
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveJsonOATS(response));

export interface PutNodeParams extends WithTaxonomyVersion {
  id: string;
  body: NodePostPut;
}

export const putNode = (params: PutNodeParams): Promise<void> =>
  client
    .PUT("/v1/nodes/{id}", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

export interface PutResourcesPrimaryParams extends WithTaxonomyVersion {
  id: string;
  recursive: boolean;
}

export const putResourcesPrimary = (params: PutResourcesPrimaryParams): Promise<void> =>
  client
    .PUT("/v1/nodes/{id}/makeResourcesPrimary", {
      params: {
        path: { id: params.id },
        query: { recursive: params.recursive },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
    })
    .then((response) => resolveVoidOrRejectWithError(response.response));

export interface CloneNodeParams extends WithTaxonomyVersion {
  id: string;
  body: {
    contentUri?: string;
    name: string;
    id?: string;
  };
}

export const cloneNode = (params: CloneNodeParams): Promise<string> =>
  client
    .POST("/v1/nodes/{id}/clone", {
      params: {
        path: { id: params.id },
      },
      headers: {
        VersionHash: params.taxonomyVersion,
      },
      body: params.body,
    })
    .then((response) => resolveLocation(response.response));
