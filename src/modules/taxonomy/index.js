/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export {
  fetchResourceTypes,
  fetchFilters,
  fetchTopicArticle,
  fetchRelevances,
  updateTaxonomy,
} from './taxonomyApi';

export {
  fetchResource,
  createResource,
  queryResources,
  queryTopics,
  fetchResourceResourceType,
  fetchResourceFilter,
  addFilterToResource,
  fetchFullResource,
  updateResourceRelevance,
  getFullResource,
  getResourceId, // fetchTopicResource,
  queryLearningPathResource,
} from './resources';
export {
  fetchAllResourceTypes,
  createResourceResourceType,
  deleteResourceResourceType,
  createDeleteResourceTypes,
} from './resourcetypes';
export {
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  createSubjectFilter,
  createDeleteUpdateFilters,
  editSubjectFilter,
  deleteFilter,
} from './filter';
export {
  fetchAllTopicResource,
  fetchSingleTopicResource,
  createTopicResource,
  updateTopicResource,
  deleteTopicResource,
  createDeleteUpdateTopicResources,
} from './topicresouces';

export {
  fetchSubjects,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  fetchSubjectFilters,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
} from './subjects';

export {
  addTopic,
  fetchTopics,
  fetchTopic,
  fetchTopicFilters,
  updateTopic,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  addFilterToTopic,
  updateTopicFilter,
  deleteTopicFilter,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicSubtopic,
  deleteTopic,
  updateTopicMetadata,
} from './topics';
