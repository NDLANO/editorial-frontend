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

const baseUrl = apiResourceUrl(taxonomyApi);

function fetchSubjects(locale) {
  return fetchAuthorized(`${baseUrl}/subjects?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubject(id, language) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubjectTopics(subject, language) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?recursive=true&language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

function addSubject(body) {
  return fetchAuthorized(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function addSubjectTopic(body) {
  return fetchAuthorized(`${baseUrl}/subject-topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateSubjectName(id, name) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name }),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateSubjectTopic(connectionId, body) {
  return fetchAuthorized(`${baseUrl}/subject-topics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateSubject(id, name, contentUri) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri }),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateSubjectMetadata(subjectId, body) {
  return fetchAuthorized(`${baseUrl}/subjects/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

function updateSubjectMetadataRecursive(subjectId, body) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subjectId}/metadata-recursive?applyToResources=true`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    },
  ).then(res => resolveJsonOrRejectWithError(res, { taxonomy: true }));
}

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubjectMetadataRecursive,
  updateSubject,
};
