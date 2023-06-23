/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType, Metadata, ResolvedUrl } from '@ndla/types-taxonomy';
import { apiResourceUrl, httpFunctions } from '../../util/apiHelpers';
import { updateResourceMetadata } from './resources';
import { createDeleteResourceTypes } from './resourcetypes';
import { createDeleteUpdateTopicResources } from './topicresouces';
import { taxonomyApi } from '../../config';
import {
  ParentTopicWithRelevanceAndConnections,
  ResourceResourceType,
} from './taxonomyApiInterfaces';
import { WithTaxonomyVersion } from '../../interfaces';

const baseUrl = apiResourceUrl(taxonomyApi);

const { fetchAndResolve } = httpFunctions;

interface ResourceTypesGetParams extends WithTaxonomyVersion {
  language: string;
}
/* Option items */
const fetchResourceTypes = ({
  language,
  taxonomyVersion,
}: ResourceTypesGetParams): Promise<ResourceType[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/resource-types`,
    taxonomyVersion,
    queryParams: { language },
  });
};

interface ResolveUrlsParams extends WithTaxonomyVersion {
  path: string;
}

const resolveUrls = ({ path, taxonomyVersion }: ResolveUrlsParams): Promise<ResolvedUrl> => {
  return fetchAndResolve({
    url: `${baseUrl}/url/resolve`,
    taxonomyVersion,
    queryParams: { path },
  });
};

/* Queries */

interface UpdateTaxonomyParams extends WithTaxonomyVersion {
  resourceId: string;
  resourceTaxonomy: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
  };
  taxonomyChanges: {
    resourceTypes: ResourceResourceType[];
    topics: ParentTopicWithRelevanceAndConnections[];
    metadata?: Metadata;
  };
}

/* Taxonomy actions */
async function updateTaxonomy({
  resourceId,
  resourceTaxonomy,
  taxonomyChanges,
  taxonomyVersion,
}: UpdateTaxonomyParams): Promise<boolean> {
  await Promise.all([
    createDeleteResourceTypes({
      resourceId,
      resourceTypes: taxonomyChanges.resourceTypes,
      originalResourceTypes: resourceTaxonomy.resourceTypes,
      taxonomyVersion,
    }),

    taxonomyChanges.metadata &&
      updateResourceMetadata({ resourceId, body: taxonomyChanges.metadata, taxonomyVersion }),

    createDeleteUpdateTopicResources({
      resourceId,
      topics: taxonomyChanges.topics,
      originalTopics: resourceTaxonomy.topics,
      taxonomyVersion,
    }),
  ]);
  return true;
}

export { fetchResourceTypes, updateTaxonomy, resolveUrls };
