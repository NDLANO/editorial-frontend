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
  return fetchAuthorized(`${baseUrl}/subjects/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubjectTopics(subject) {
  return fetchAuthorized(
    `${baseUrl}/subjects/${subject}/topics?recursive=true`,
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
  }).then(resolveJsonOrRejectWithError);
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

function fetchSubjectFilters(id) {
  return fetchAuthorized(`${baseUrl}/subjects/${id}/filters`).then(res =>
    resolveJsonOrRejectWithError(res),
  );
}

export {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  addSubjectTopic,
  fetchSubjectFilters,
  updateSubjectTopic,
};
