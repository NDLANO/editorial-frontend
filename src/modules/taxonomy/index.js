/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchTopicArticle,
  fetchRelevances,
  queryResources,
  updateTaxonomy,
  resolveTaxonomyJsonOrRejectWithError,
} from './taxonomyApi';
import {
  fetchResource,
  createResource,
  fetchResourceResourceType,
  fetchResourceFilter,
  // fetchTopicResource,
} from './resources';
import {
  createResourceResourceType,
  deleteResourceResourceType,
  createDeleteResourceTypes,
} from './resourcetypes';
import {
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  createDeleteUpdateFilters,
} from './filter';
import {
  fetchAllTopicResource,
  fetchSingleTopicResource,
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
} from './topicresouces';

export {
  fetchResourceTypes,
  fetchResource,
  createResource,
  fetchResourceResourceType,
  createResourceResourceType,
  deleteResourceResourceType,
  createDeleteResourceTypes,
  fetchResourceFilter,
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  createDeleteUpdateFilters,
  fetchAllTopicResource,
  fetchSingleTopicResource,
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
  fetchFilters,
  fetchTopics,
  fetchTopicArticle,
  // fetchTopicResource,
  fetchRelevances,
  queryResources,
  updateTaxonomy,
  resolveTaxonomyJsonOrRejectWithError,
};
