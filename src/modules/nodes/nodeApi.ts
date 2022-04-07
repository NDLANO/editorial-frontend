/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { taxonomyApi } from '../../config';
import { apiResourceUrl, httpFunctions } from '../../util/apiHelpers';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../util/resolveJsonOrRejectWithError';
import { TaxonomyMetadata } from '../taxonomy/taxonomyApiInterfaces';
import {
  GetChildNodesParams,
  GetNodeParams,
  GetNodeResourcesParams,
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
} from './nodeApiTypes';

const baseUrl = apiResourceUrl(`${taxonomyApi}/nodes`);
const connUrl = apiResourceUrl(`${taxonomyApi}/node-connections`);
const resUrl = apiResourceUrl(`${taxonomyApi}/node-resources`);

const { postAndResolve, fetchAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => `?${queryString.stringify(object)}`;

export const fetchNode = (
  id: string,
  taxonomyVersion: string,
  language?: string,
): Promise<NodeType> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}${stringifyQuery({ language })}`,
    taxonomyVersion,
  });
};

export const fetchNodes = (params: GetNodeParams, taxonomyVersion: string): Promise<NodeType[]> =>
  fetchAndResolve({
    url: `${baseUrl}${stringifyQuery(params)}`,
    taxonomyVersion,
  });

export const postNode = (newNode: NodePostPatchType, taxonomyVersion: string): Promise<string> =>
  postAndResolve({
    url: baseUrl,
    body: JSON.stringify(newNode),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

export const fetchConnectionsForNode = (
  id: string,
  taxonomyVersion: string,
): Promise<ConnectionForNode[]> =>
  fetchAndResolve({
    url: `${baseUrl}/${id}/connections`,
    taxonomyVersion,
  });

export const deleteNode = (id: string, taxonomyVersion: string): Promise<void> =>
  deleteAndResolve({ url: `${baseUrl}/${id}`, taxonomyVersion });

export const putNodeMetadata = (
  id: string,
  meta: Partial<TaxonomyMetadata>,
  taxonomyVersion: string,
): Promise<TaxonomyMetadata> =>
  putAndResolve({
    body: JSON.stringify(meta),
    url: `${baseUrl}/${id}/metadata`,
    taxonomyVersion,
  });

export const fetchChildNodes = (
  id: string,
  taxonomyVersion: string,
  params?: GetChildNodesParams,
): Promise<ChildNodeType[]> =>
  fetchAndResolve({
    url: `${baseUrl}/${id}/nodes${stringifyQuery(params)}`,
    taxonomyVersion,
  });

export const fetchNodeTranslations = (
  id: string,
  taxonomyVersion: string,
): Promise<NodeTranslation[]> =>
  fetchAndResolve({ url: `${baseUrl}/${id}/translations`, taxonomyVersion });

export const deleteNodeTranslation = (
  id: string,
  language: string,
  taxonomyVersion: string,
): Promise<void> => {
  return deleteAndResolve({
    url: `${baseUrl}/${id}/translations/${language}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
};

export const putNodeTranslation = (
  id: string,
  language: string,
  translation: NodeTranslationPutType,
  taxonomyVersion: string,
): Promise<void> =>
  putAndResolve({
    url: `${baseUrl}/${id}/translations/${language}`,
    body: JSON.stringify(translation),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

export const fetchNodeResources = (
  id: string,
  taxonomyVersion: string,
  params?: GetNodeResourcesParams,
): Promise<ResourceWithNodeConnection[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}/resources${stringifyQuery(params)}`,
    taxonomyVersion,
  });
};

export const deleteNodeConnection = (id: string, taxonomyVersion: string): Promise<void> =>
  deleteAndResolve({
    url: `${connUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

export const putNodeConnection = (
  id: string,
  body: NodeConnectionPutType,
  taxonomyVersion: string,
): Promise<void> =>
  putAndResolve({
    url: `${connUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

export const postNodeConnection = (
  body: NodeConnectionPostType,
  taxonomyVersion: string,
): Promise<string> =>
  postAndResolve({
    url: `${connUrl}`,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
    taxonomyVersion,
  });

export const postResourceForNode = (
  body: NodeResourcePostType,
  taxonomyVersion: string,
): Promise<void> =>
  postAndResolve({
    url: resUrl,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

export const deleteResourceForNode = (id: string, taxonomyVersion: string): Promise<void> =>
  deleteAndResolve({
    url: `${resUrl}/${id}`,
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });

export const putResourceForNode = (
  id: string,
  body: NodeResourcePutType,
  taxonomyVersion: string,
): Promise<void> =>
  putAndResolve({
    url: `${resUrl}/${id}`,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
    taxonomyVersion,
  });
