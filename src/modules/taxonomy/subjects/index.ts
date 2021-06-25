/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetchAuthorized,
} from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { SubjectTopic, SubjectType, TaxonomyMetadata } from '../taxonomyApiInterfaces';
import { resolveTaxonomyJsonOrRejectWithError } from '../helpers';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchSubjects = async (locale: string): Promise<SubjectType[]> => {
  return await fetchAuthorized(`${baseUrl}/subjects?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchSubject = async (id: string, language: string): Promise<SubjectType> => {
  return await fetchAuthorized(`${baseUrl}/subjects/${id}?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchSubjectTopics = async (subject: string, language: string): Promise<SubjectTopic[]> => {
  return await fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?recursive=true&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
};

const addSubject = async (body: {
  contentUri: string;
  id?: string;
  name: string;
}): Promise<string> => {
  return await fetchAuthorized(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const addSubjectTopic = async (body: {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
  subjectid: string;
  topicid: string;
}): Promise<string> => {
  return await fetchAuthorized(`${baseUrl}/subject-topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectName = async (id: string, name: string): Promise<boolean> => {
  return await fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectTopic = async (
  connectionId: string,
  body: {
    rank: number;
    primary?: boolean;
    relevanceId?: string;
  },
): Promise<boolean> => {
  return await fetchAuthorized(`${baseUrl}/subject-topics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubject = async (id: string, name?: string, contentUri?: string): Promise<boolean> => {
  return await fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectMetadata = async (
  subjectId: string,
  body: {
    grepCodes?: string[];
    visible?: boolean;
    customFields?: Record<string, string>;
  },
): Promise<TaxonomyMetadata> => {
  return await fetchAuthorized(`${baseUrl}/subjects/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubject,
};
