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
  fetchResourceTranslations,
  setResourceTranslation,
} from './resources';
export {
  fetchAllResourceTypes,
  fetchResourceType,
  createResourceResourceType,
  deleteResourceResourceType,
  createDeleteResourceTypes,
} from './resourcetypes';
export {
  createResourceFilter,
  updateResourceFilter,
  deleteResourceFilter,
  fetchSubjectFilter,
  createDeleteUpdateFilters,
  createSubjectFilter,
  updateSubjectFilter,
  deleteFilter,
  updateFilterMetadata,
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
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  updateSubjectName,
  updateSubject,
  fetchSubjectFilters,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubjectMetadataRecursive,
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
  updateTopicMetadataRecursive,
} from './topics';
