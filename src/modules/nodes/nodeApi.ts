/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
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
} from "@ndla/types-taxonomy";
import { GetChildNodesParams, GetNodeParams, GetNodeResourcesParams } from "./nodeApiTypes";
import { taxonomyApi } from "../../config";
import { SearchResultBase, WithTaxonomyVersion } from "../../interfaces";
import { apiResourceUrl, httpFunctions, stringifyQuery } from "../../util/apiHelpers";
import { resolveLocation, resolveVoidOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

const baseUrl = apiResourceUrl(`${taxonomyApi}/nodes`);
const connUrl = apiResourceUrl(`${taxonomyApi}/node-connections`);
const resUrl = apiResourceUrl(`${taxonomyApi}/node-resources`);

const { postAndResolve, fetchAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

interface NodeGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const fetchNode = ({ id, language, taxonomyVersion }: NodeGetParams): Promise<Node> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface NodesGetParams extends WithTaxonomyVersion, GetNodeParams {}

export const fetchNodes = ({ taxonomyVersion, ...queryParams }: NodesGetParams): Promise<Node[]> =>
  fetchAndResolve({ url: baseUrl, taxonomyVersion, queryParams });

interface NodePostParams extends WithTaxonomyVersion {
  body: NodePostPut;
}

export const postNode = ({ body, taxonomyVersion }: NodePostParams): Promise<string> =>
  postAndResolve({
    url: baseUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

interface ConnectionsForNodeGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchConnectionsForNode = ({ id, taxonomyVersion }: ConnectionsForNodeGetParams): Promise<Connection[]> =>
  fetchAndResolve({
    url: `${baseUrl}/${id}/connections`,
    taxonomyVersion,
  });

interface NodeDeleteParams extends WithTaxonomyVersion {
  id: string;
}
export const deleteNode = ({ id, taxonomyVersion }: NodeDeleteParams): Promise<void> =>
  deleteAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });

interface NodeMetadataPutParams extends WithTaxonomyVersion {
  id: string;
  meta: Partial<Metadata>;
}
export const putNodeMetadata = ({ id, meta, taxonomyVersion }: NodeMetadataPutParams): Promise<Metadata> =>
  putAndResolve({
    body: JSON.stringify(meta),
    url: `${baseUrl}/${id}/metadata`,
    taxonomyVersion,
  });

interface ChildNodesGetParams extends WithTaxonomyVersion, GetChildNodesParams {
  id: string;
}
export const fetchChildNodes = ({
  id,
  recursive,
  nodeType,
  language,
  taxonomyVersion,
  includeContexts,
  isVisible,
}: ChildNodesGetParams): Promise<NodeChild[]> =>
  fetchAndResolve({
    url: `${baseUrl}/${id}/nodes`,
    taxonomyVersion,
    queryParams: { recursive, nodeType, language, includeContexts, isVisible },
  });

interface NodeTranslationsGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchNodeTranslations = ({ id, taxonomyVersion }: NodeTranslationsGetParams): Promise<Translation[]> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/translations`, taxonomyVersion });

interface NodeTranslationDeleteParams extends WithTaxonomyVersion {
  id: string;
  language: string;
}

export const deleteNodeTranslation = ({
  id,
  language,
  taxonomyVersion,
}: NodeTranslationDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}/translations/${language}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

interface NodeTranslationPutParams extends WithTaxonomyVersion {
  id: string;
  language: string;
  body: TranslationPUT;
}

export const putNodeTranslation = ({ id, language, body, taxonomyVersion }: NodeTranslationPutParams): Promise<void> =>
  putAndResolve({
    url: `${baseUrl}/${id}/translations/${language}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeResourcesGetParams extends WithTaxonomyVersion, GetNodeResourcesParams {
  id: string;
}

export const fetchNodeResources = ({
  id,
  taxonomyVersion,
  ...queryParams
}: NodeResourcesGetParams): Promise<NodeChild[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}/resources`,
    taxonomyVersion,
    queryParams,
  });
};

interface NodeConnectionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteNodeConnection = ({ id, taxonomyVersion }: NodeConnectionDeleteParams): Promise<void> =>
  deleteAndResolve({
    url: `${connUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeConnectionPutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeConnectionPUT;
}

export const putNodeConnection = ({ id, body, taxonomyVersion }: NodeConnectionPutParams): Promise<void> =>
  putAndResolve({
    url: `${connUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeConnectionPostParams extends WithTaxonomyVersion {
  body: NodeConnectionPOST;
}

export const postNodeConnection = ({ body, taxonomyVersion }: NodeConnectionPostParams): Promise<string> =>
  postAndResolve({
    url: `${connUrl}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

interface NodeResourcePostParams extends WithTaxonomyVersion {
  body: NodeResourcePOST;
}

export const postResourceForNode = ({ body, taxonomyVersion }: NodeResourcePostParams): Promise<string> =>
  postAndResolve({
    url: resUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

interface NodeResourceDeleteParams extends WithTaxonomyVersion {
  id: string;
}
export const deleteResourceForNode = ({ id, taxonomyVersion }: NodeResourceDeleteParams): Promise<void> =>
  deleteAndResolve({
    url: `${resUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeResourcePutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeResourcePUT;
}

export const putResourceForNode = ({ id, body, taxonomyVersion }: NodeResourcePutParams): Promise<void> =>
  putAndResolve({
    url: `${resUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface SearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: NodeType;
  page?: number;
  pageSize?: number;
  query?: string;
}

export const searchNodes = ({ taxonomyVersion, ...queryParams }: SearchNodes): Promise<SearchResultBase<Node>> => {
  return fetchAndResolve({
    url: `${baseUrl}/search`,
    taxonomyVersion,
    queryParams,
  });
};

interface PostSearchNodes extends WithTaxonomyVersion {
  pageSize?: number;
  customFields?: Record<string, string>;
}

export const postSearchNodes = ({ taxonomyVersion, ...body }: PostSearchNodes): Promise<SearchResultBase<Node>> => {
  return postAndResolve({
    url: `${baseUrl}/search`,
    body: JSON.stringify(body),
    taxonomyVersion,
  });
};

export interface PutNodeParams extends WithTaxonomyVersion, Omit<NodePostPut, "nodeType"> {
  id: string;
  nodeType?: string;
}

export const putNode = ({ taxonomyVersion, id, ...params }: PutNodeParams): Promise<void> => {
  return putAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    body: JSON.stringify(params),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

export interface PutResourcesPrimaryParams extends WithTaxonomyVersion {
  id: string;
  recursive: boolean;
}

export const putResourcesPrimary = ({ id, recursive, taxonomyVersion }: PutResourcesPrimaryParams): Promise<void> => {
  const queryParams = stringifyQuery({ recursive });
  return putAndResolve({
    url: `${baseUrl}/${id}/makeResourcesPrimary${queryParams}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

export interface CloneNodeParams extends WithTaxonomyVersion {
  id: string;
  body: {
    contentUri?: string;
    name: string;
    id?: string;
  };
}

export const cloneNode = ({ id, body, taxonomyVersion }: CloneNodeParams): Promise<string> => {
  return postAndResolve({
    url: `${baseUrl}/${id}/clone`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};
