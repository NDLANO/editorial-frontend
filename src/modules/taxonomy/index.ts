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
  getResourceId,
  queryLearningPathResource,
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
  updateSubject,
  addSubjectTopic,
} from './subjects';

export {
  addTopic,
  fetchTopic,
  addTopicToTopic,
  fetchTopicResources,
  fetchTopicConnections,
  updateTopicMetadata,
} from './topics';
