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
import {
  ParentTopicWithRelevanceAndConnections,
  ResolvedUrl,
  ResourceResourceType,
  ResourceType,
  SubjectType,
  TaxonomyMetadata,
} from './taxonomyApiInterfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

/* Option items */
const fetchResourceTypes = async (language: string): Promise<ResourceType[]> => {
  return await fetchAuthorized(`${baseUrl}/resource-types/?language=${language}`).then(
    resolveJsonOrRejectWithError,
  );
};

const fetchSubject = async (subjectUrn: string): Promise<SubjectType> => {
  return await fetchAuthorized(`${baseUrl}/subjects/${subjectUrn}`).then(
    resolveJsonOrRejectWithError,
  );
};

const resolveUrls = async (path: string): Promise<ResolvedUrl> => {
  return await fetchAuthorized(`${baseUrl}/url/resolve?path=${path}`).then(
    resolveJsonOrRejectWithError,
  );
};

/* Queries */

/* Taxonomy actions */
async function updateTaxonomy(
  resourceId: string,
  resourceTaxonomy: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
  },
  taxonomyChanges: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
    metadata: TaxonomyMetadata;
  },
): Promise<boolean> {
  try {
    await Promise.all([
      createDeleteResourceTypes(
        resourceId,
        taxonomyChanges.resourceTypes,
        resourceTaxonomy.resourceTypes,
      ),

      updateResourceMetadata(resourceId, taxonomyChanges.metadata),

      createDeleteUpdateTopicResources(resourceId, taxonomyChanges.topics, resourceTaxonomy.topics),
    ]);
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export { fetchResourceTypes, fetchSubject, updateTaxonomy, resolveUrls };
