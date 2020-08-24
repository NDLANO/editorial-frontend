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

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchSubjects(locale) {
  return fetchAuthorized(
    `${baseUrl}/subjects?includeMetadata=true&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function fetchSubject(id, locale) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${id}?includeMetadata=true&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function fetchSubjectTopics(subject, locale) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?includeMetadata=true&recursive=true&language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

function addSubject(body) {
  return fetchAuthorized(`${baseUrl}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function addSubjectTopic(body) {
  return fetchAuthorized(`${baseUrl}/subject-topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function updateSubjectName(id, name) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name }),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function updateSubjectTopic(connectionId, body) {
  return fetchAuthorized(`${baseUrl}/subject-topics/${connectionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function updateSubjectContentUri(id, name, contentUri) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ name, contentUri }),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function fetchSubjectFilters(id) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}/filters`).then(res =>
    resolveJsonOrRejectWithError(res),
  );
}

function updateSubjectMetadata(subjectId, body) {
  return fetchAuthorized(`${baseUrl}/subjects/${subjectId}/metadata`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  }).then(res => resolveJsonOrRejectWithError(res, true));
}

function updateSubjectMetadataRecursive(subjectId, body) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subjectId}/metadata-recursive?applyToResources=true`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    },
  ).then(res => resolveJsonOrRejectWithError(res, true));
}

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  addSubjectTopic,
  fetchSubjectFilters,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubjectMetadataRecursive,
  updateSubjectContentUri,
};
