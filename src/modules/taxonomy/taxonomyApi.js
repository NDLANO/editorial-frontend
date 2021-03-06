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
import { createDeleteUpdateTopicResources } from './topicresouces';
import { taxonomyApi } from '../../config';

const baseUrl = apiResourceUrl(taxonomyApi);

/* Option items */
function fetchResourceTypes(language) {
  return fetchAuthorized(`${baseUrl}/resource-types/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchRelevances(language) {
  return fetchAuthorized(`${baseUrl}/relevances/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
}

function fetchSubject(subjectUrn) {
  return fetchAuthorized(`${baseUrl}/subjects/${subjectUrn}`).then(resolveJsonOrRejectWithError);
}

function resolveUrls(path) {
  return fetchAuthorized(`${baseUrl}/url/resolve?path=${path}`).then(resolveJsonOrRejectWithError);
}

/* Queries */

/* Taxonomy actions */
async function updateTaxonomy(
  resourceId,
  { topics: originalTopics, resourceTypes: originalResourceTypes },
  taxonomyChanges,
  language,
) {
  try {
    await Promise.all([
      createDeleteResourceTypes(resourceId, taxonomyChanges.resourceTypes, originalResourceTypes),

      updateResourceMetadata(resourceId, taxonomyChanges.metadata),

      createDeleteUpdateTopicResources(resourceId, taxonomyChanges.topics, originalTopics),
    ]);
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export { fetchResourceTypes, fetchRelevances, fetchSubject, updateTaxonomy, resolveUrls };
