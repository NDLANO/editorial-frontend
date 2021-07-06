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
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';

const baseUrl = apiResourceUrl(taxonomyApi);

const fetchSubjects = (locale: string): Promise<SubjectType[]> => {
  return fetchAuthorized(`${baseUrl}/subjects?language=${locale}`).then(r =>
    resolveJsonOrRejectWithError<SubjectType[]>(r),
  );
};

const fetchSubject = (id: string, language?: string): Promise<SubjectType> => {
  const lng = language ? `?language=${language}` : '';
  return fetchAuthorized(`${baseUrl}/subjects/${id}${lng}`).then(r =>
    resolveJsonOrRejectWithError<SubjectType>(r),
  );
};

const fetchSubjectTopics = (subject: string, language: string): Promise<SubjectTopic[]> => {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?recursive=true&language=${language}`,
  ).then(r => resolveJsonOrRejectWithError<SubjectTopic[]>(r));
};

const addSubject = (body: { contentUri: string; id?: string; name: string }): Promise<string> => {
  return fetchAuthorized(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveLocation);
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
  }).then(resolveLocation);
};

const updateSubjectTopic = (
  connectionId: string,
  body: {
    rank: number;
    primary?: boolean;
    relevanceId?: string;
  },
): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/subject-topics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(resolveVoidOrRejectWithError);
};

const updateSubject = (id: string, name?: string, contentUri?: string): Promise<void> => {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri }),
  }).then(resolveVoidOrRejectWithError);
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
  }).then(r => resolveJsonOrRejectWithError<TaxonomyMetadata>(r));
};

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubject,
};
