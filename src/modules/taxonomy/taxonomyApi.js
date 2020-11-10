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
import { updateResourceMetadata } from './resources';
import { createDeleteResourceTypes } from './resourcetypes';
import { createDeleteUpdateFilters } from './filter';
import { createDeleteUpdateTopicResources } from './topicresouces';

const baseUrl = apiResourceUrl('/taxonomy/v1');

/* Option items */
function fetchResourceTypes(language) {
  return fetchAuthorized(
    `${baseUrl}/resource-types/?language=${language}`,
  ).then(resolveJsonOrRejectWithError);
}

function fetchFilters(language) {
  return fetchAuthorized(`${baseUrl}/filters/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchRelevances(language) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubject(subjectUrn) {
  return fetchAuthorized(`${baseUrl}/subjects/${subjectUrn}`).then(
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

      updateResourceMetadata(resourceId, taxonomyChanges.metadata),

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
  fetchRelevances,
  fetchSubject,
  updateTaxonomy,
  resolveUrls,
};
