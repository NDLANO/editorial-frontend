import queryString from 'query-string';
import { taxonomyApi } from '../../../config';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import {
  GetChildNodesParams,
  GetNodeParams,
  GetNodeResourcesParams,
  NodeType,
  NodeMetadata,
  NodePostPatchType,
  RecursiveNodeMetadataUpdateResult,
  NodeTranslation,
  NodeTranslationPutType,
  ChildNodeType,
  NodeConnection,
  NodeConnectionPutType,
  NodeConnectionPostType,
  ConnectionForNode,
  NodeResource,
  NodeResourcePostType,
  NodeResourcePutType,
  ResourceWithNodeConnection,
} from './nodeApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/nodes`);
const connUrl = apiResourceUrl(`${taxonomyApi}/node-connections`);
const resUrl = apiResourceUrl(`${taxonomyApi}/node-resources`);

const { postAndResolve, fetchAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => `?${queryString.stringify(object)}`;

export const fetchNode = (id: string, language?: string): Promise<NodeType> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}${stringifyQuery({ language })}` });
};

export const fetchNodes = (params: GetNodeParams): Promise<NodeType[]> =>
  fetchAndResolve({ url: `${baseUrl}${stringifyQuery(params)}` });

export const postNode = (newNode: NodePostPatchType): Promise<string> =>
  postAndResolve({ url: baseUrl, body: JSON.stringify(newNode) });

export const fetchConnectionsForNode = (id: string): Promise<ConnectionForNode[]> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/connections` });

export const putNode = (id: string, node: NodePostPatchType): Promise<any> =>
  putAndResolve({ body: JSON.stringify(node), url: `${baseUrl}/${id}` });

export const deleteNode = (id: string): Promise<void> =>
  deleteAndResolve({ url: `${baseUrl}/${id}` });

export const fetchNodeMetadata = (id: string): Promise<NodeMetadata> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/metadata` });

export const putNodeMetadata = (id: string, meta: Partial<NodeMetadata>): Promise<NodeMetadata> =>
  putAndResolve({ body: JSON.stringify(meta), url: `${baseUrl}/${id}/metadata` });

export const fetchChildNodes = (
  id: string,
  params?: GetChildNodesParams,
): Promise<ChildNodeType[]> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/nodes${stringifyQuery(params)}` });

export const fetchNodeTranslations = (id: string): Promise<NodeTranslation[]> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/translations` });

export const fetchNodeTranslation = (id: string, language: string): Promise<NodeTranslation> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}/translations/${language}` });
};

export const deleteNodeTranslation = (id: string, language: string): Promise<void> => {
  return deleteAndResolve({ url: `${baseUrl}/${id}/translations/${language}` });
};

export const putNodeTranslation = (
  id: string,
  language: string,
  translation: NodeTranslationPutType,
): Promise<void> =>
  putAndResolve({
    url: `${baseUrl}/${id}/translations/${language}`,
    body: JSON.stringify(translation),
    alternateResolve: resolveVoidOrRejectWithError,
  });

export const putNodeMetadataRecursive = (
  id: string,
  meta: NodeMetadata,
  applyToResources?: boolean,
): Promise<RecursiveNodeMetadataUpdateResult> =>
  putAndResolve({
    url: `${baseUrl}/${id}/metadata-recursive`,
    body: JSON.stringify({ applyToResources, meta }),
  });

export const fetchNodeResources = (
  id: string,
  params?: GetNodeResourcesParams,
): Promise<ResourceWithNodeConnection[]> => {
  return fetchAndResolve({ url: `${baseUrl}/${id}/resources${stringifyQuery(params)}` });
};

export const fetchNodeConnections = (): Promise<NodeConnection[]> =>
  fetchAndResolve({ url: connUrl });

export const fetchNodeConnection = (id: string): Promise<NodeConnection> =>
  fetchAndResolve({ url: `${connUrl}/${id}` });

export const deleteNodeConnection = (id: string): Promise<void> =>
  deleteAndResolve({ url: `${connUrl}/${id}`, alternateResolve: resolveVoidOrRejectWithError });

export const putNodeConnection = (id: string, body: NodeConnectionPutType): Promise<void> =>
  putAndResolve({
    url: `${connUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });

export const postNodeConnection = (body: NodeConnectionPostType): Promise<string> =>
  postAndResolve({
    url: `${connUrl}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });

export const fetchResourcesForNodes = (): Promise<NodeResource[]> =>
  fetchAndResolve({ url: resUrl });

export const fetchResourceForNode = (id: string): Promise<NodeResource[]> =>
  fetchAndResolve({ url: `${resUrl}/${id}` });

export const postResourceForNode = (body: NodeResourcePostType): Promise<void> =>
  postAndResolve({
    url: resUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });

export const deleteResourceForNode = (id: string): Promise<void> =>
  deleteAndResolve({ url: `${resUrl}/${id}`, alternateResolve: resolveVoidOrRejectWithError });

export const putResourceForNode = (id: string, body: NodeResourcePutType): Promise<void> =>
  putAndResolve({
    url: `${resUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
