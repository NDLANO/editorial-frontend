/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError, apiResourceUrl, headerWithAccessToken } from '../../util/apiHelpers';

const baseUrl = apiResourceUrl('/taxonomy/v1');

export const fetchSubjects = token => fetch(`${baseUrl}/subjects/`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchSubject = (token, subjectId) => fetch(`${baseUrl}/subjects/${subjectId}`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);

export const fetchTopics = (token, subjectId) => fetch(`${baseUrl}/subjects/${subjectId}/topics/?recursive=true`, { headers: headerWithAccessToken(token) }).then(resolveJsonOrRejectWithError);
