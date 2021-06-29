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

const fetchSubjects = (locale: string): Promise<SubjectType[]> => {
  return fetchAuthorized(`${baseUrl}/subjects?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchSubject = (id: string, language?: string): Promise<SubjectType> => {
  const lng = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/subjects/${id}${lng}`).then(resolveJsonOrRejectWithError);
};

const fetchSubjectTopics = (subject: string, language: string): Promise<SubjectTopic[]> => {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?recursive=true&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
};

const addSubject = (body: { contentUri: string; id?: string; name: string }): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const addSubjectTopic = (body: {
  primary?: boolean;
  rank?: number;
  relevanceId?: string;
  subjectid: string;
  topicid: string;
}): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/subject-topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectName = (id: string, name: string): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectTopic = (
  connectionId: string,
  body: {
    rank: number;
    primary?: boolean;
    relevanceId?: string;
  },
): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/subject-topics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubject = (id: string, name?: string, contentUri?: string): Promise<boolean> => {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri }),
  }).then(resolveTaxonomyJsonOrRejectWithError);
};

const updateSubjectMetadata = (
  subjectId: string,
  body: {
    grepCodes?: string[];
    visible?: boolean;
    customFields?: Record<string, string>;
  },
): Promise<TaxonomyMetadata> => {
  return fetchAuthorized(`${baseUrl}/subjects/${subjectId}/metadata`, {
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
