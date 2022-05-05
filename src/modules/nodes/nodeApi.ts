/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { taxonomyApi } from '../../config';
import { SearchResultBase, WithTaxonomyVersion } from '../../interfaces';
import { apiResourceUrl, httpFunctions, stringifyQuery } from '../../util/apiHelpers';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../util/resolveJsonOrRejectWithError';
import { TaxonomyMetadata } from '../taxonomy/taxonomyApiInterfaces';
import {
  NodeType,
  NodePostPatchType,
  NodeTranslation,
  NodeTranslationPutType,
  ChildNodeType,
  NodeConnectionPutType,
  NodeConnectionPostType,
  ConnectionForNode,
  NodeResourcePostType,
  NodeResourcePutType,
  ResourceWithNodeConnection,
  GetNodeParams,
  GetChildNodesParams,
  GetNodeResourcesParams,
} from './nodeApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/nodes`);
const connUrl = apiResourceUrl(`${taxonomyApi}/node-connections`);
const resUrl = apiResourceUrl(`${taxonomyApi}/node-resources`);

const { postAndResolve, fetchAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

interface NodeGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

export const fetchNode = ({ id, language, taxonomyVersion }: NodeGetParams): Promise<NodeType> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface NodesGetParams extends WithTaxonomyVersion, GetNodeParams {}

export const fetchNodes = ({
  taxonomyVersion,
  ...queryParams
}: NodesGetParams): Promise<NodeType[]> =>
  fetchAndResolve({ url: baseUrl, taxonomyVersion, queryParams });

interface NodePostParams extends WithTaxonomyVersion {
  body: NodePostPatchType;
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

export const fetchConnectionsForNode = ({
  id,
  taxonomyVersion,
}: ConnectionsForNodeGetParams): Promise<ConnectionForNode[]> =>
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
  meta: Partial<TaxonomyMetadata>;
}
export const putNodeMetadata = ({
  id,
  meta,
  taxonomyVersion,
}: NodeMetadataPutParams): Promise<TaxonomyMetadata> =>
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
  language,
  taxonomyVersion,
}: ChildNodesGetParams): Promise<ChildNodeType[]> =>
  fetchAndResolve({
    url: `${baseUrl}/${id}/nodes`,
    taxonomyVersion,
    queryParams: { recursive, language },
  });

interface NodeTranslationsGetParams extends WithTaxonomyVersion {
  id: string;
}

export const fetchNodeTranslations = ({
  id,
  taxonomyVersion,
}: NodeTranslationsGetParams): Promise<NodeTranslation[]> =>
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
  body: NodeTranslationPutType;
}

export const putNodeTranslation = ({
  id,
  language,
  body,
  taxonomyVersion,
}: NodeTranslationPutParams): Promise<void> =>
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
}: NodeResourcesGetParams): Promise<ResourceWithNodeConnection[]> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}/resources`, taxonomyVersion, queryParams });
};

interface NodeConnectionDeleteParams extends WithTaxonomyVersion {
  id: string;
}

export const deleteNodeConnection = ({
  id,
  taxonomyVersion,
}: NodeConnectionDeleteParams): Promise<void> =>
  deleteAndResolve({
    url: `${connUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeConnectionPutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeConnectionPutType;
}

export const putNodeConnection = ({
  id,
  body,
  taxonomyVersion,
}: NodeConnectionPutParams): Promise<void> =>
  putAndResolve({
    url: `${connUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeConnectionPostParams extends WithTaxonomyVersion {
  body: NodeConnectionPostType;
}

export const postNodeConnection = ({
  body,
  taxonomyVersion,
}: NodeConnectionPostParams): Promise<string> =>
  postAndResolve({
    url: `${connUrl}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

interface NodeResourcePostParams extends WithTaxonomyVersion {
  body: NodeResourcePostType;
}

export const postResourceForNode = ({
  body,
  taxonomyVersion,
}: NodeResourcePostParams): Promise<void> =>
  postAndResolve({
    url: resUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeResourceDeleteParams extends WithTaxonomyVersion {
  id: string;
}
export const deleteResourceForNode = ({
  id,
  taxonomyVersion,
}: NodeResourceDeleteParams): Promise<void> =>
  deleteAndResolve({
    url: `${resUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface NodeResourcePutParams extends WithTaxonomyVersion {
  id: string;
  body: NodeResourcePutType;
}

export const putResourceForNode = ({
  id,
  body,
  taxonomyVersion,
}: NodeResourcePutParams): Promise<void> =>
  putAndResolve({
    url: `${resUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

interface PublishNodeParams {
  id: string;
  targetId: string;
  sourceId?: string;
}

export const publishNode = ({ id, targetId, sourceId }: PublishNodeParams) => {
  const queryParams = stringifyQuery({ targetId, sourceId });
  return putAndResolve({
    url: `${baseUrl}/${id}/publish${queryParams}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion: 'default',
  });
};

interface SearchNodes extends WithTaxonomyVersion {
  ids?: string[];
  language?: string;
  nodeType?: 'NODE' | 'TOPIC' | 'SUBJECT';
  page?: number;
  pageSize?: number;
  query?: string;
}

export const searchNodes = ({
  taxonomyVersion,
  ...queryParams
}: SearchNodes): Promise<SearchResultBase<NodeType>> => {
  return fetchAndResolve({
    url: `${baseUrl}/search`,
    taxonomyVersion,
    queryParams,
  });
};
