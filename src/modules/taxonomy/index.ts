/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export { fetchResourceTypes, updateTaxonomy } from './taxonomyApi';

export {
  fetchResource,
  createResource,
  queryResources,
  queryTopics,
  fetchResourceResourceType,
  fetchFullResource,
  getResourceId, // fetchTopicResource,
  queryLearningPathResource,
  fetchResourceTranslations,
  setResourceTranslation,
} from './resources';
export {
  fetchAllResourceTypes,
  fetchResourceType,
  createResourceResourceType,
  createDeleteResourceTypes,
} from './resourcetypes';
export {
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
  updateSubject,
  deleteSubject,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  fetchSubjectNameTranslations,
  updateSubjectNameTranslation,
  deleteSubjectNameTranslation,
} from './subjects';

export {
  addTopic,
  fetchTopics,
  fetchTopic,
  updateTopic,
  addTopicToTopic,
  deleteTopicConnection,
  deleteSubTopicConnection,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicSubtopic,
  deleteTopic,
  updateTopicMetadata,
} from './topics';
