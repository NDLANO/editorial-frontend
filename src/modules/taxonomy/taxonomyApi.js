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
} from '../../util/apiHelpers';
import { createDeleteResourceTypes } from './resourcetypes';
import { createDeleteUpdateFilters } from './filter';
import { createDeleteUpdateTopicResources } from './topicresouces';

const baseUrl = apiResourceUrl('/taxonomy/v1');

function fetchTopicArticle(topicId, locale) {
  return fetchAuthorized(
    `${baseUrl}/topics/${topicId}/?language=${locale}`,
  ).then(resolveJsonOrRejectWithError);
}

/* Option items */
function fetchResourceTypes(locale) {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchFilters(locale) {
  return fetchAuthorized(`${baseUrl}/filters/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchRelevances(locale) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubject(subjectId) {
  return fetchAuthorized(`${baseUrl}/subjects/urn:subject:${subjectId}`).then(
    resolveJsonOrRejectWithError,
  );
}

function resolveUrls(path) {
  return fetchAuthorized(`${baseUrl}/url/resolve?path=${path}`).then(
    resolveJsonOrRejectWithError,
  );
}

/* Queries */

/* Taxonomy actions */
async function updateTaxonomy(
  resourceId,
  {
    topics: originalTopics,
    filter: originalFilters,
    resourceTypes: originalResourceTypes,
  },
  taxonomyChanges,
  language,
) {
  try {
    await Promise.all([
      createDeleteResourceTypes(
        resourceId,
        taxonomyChanges.resourceTypes,
        originalResourceTypes,
      ),

      createDeleteUpdateFilters(
        resourceId,
        taxonomyChanges.filter,
        originalFilters,
      ),

      createDeleteUpdateTopicResources(
        resourceId,
        taxonomyChanges.topics,
        language,
        originalTopics,
      ),
    ]);
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export {
  fetchResourceTypes,
  fetchFilters,
  fetchTopicArticle,
  fetchRelevances,
  fetchSubject,
  updateTaxonomy,
  resolveUrls,
};
