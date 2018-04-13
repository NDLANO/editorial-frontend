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
  createSubjectFilter,
  createDeleteUpdateFilters,
  editSubjectFilter,
  deleteFilter,
} from './filter';
import {
  fetchAllTopicResource,
  fetchSingleTopicResource,
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
} from './topicresouces';

import {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  fetchSubjectFilters,
  addSubjectTopic,
} from './subjects';

import {
  addTopic,
  fetchTopics,
  updateTopicName,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
} from './topics/';

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
  addTopic,
  fetchTopicArticle,
  // fetchTopicResource,
  fetchRelevances,
  queryResources,
  updateTaxonomy,
  resolveTaxonomyJsonOrRejectWithError,
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  addSubjectTopic,
  createSubjectFilter,
  fetchSubjectFilters,
  editSubjectFilter,
  deleteFilter,
  updateTopicName,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
};
