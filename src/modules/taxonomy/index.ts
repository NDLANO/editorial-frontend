/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export { fetchResourceTypes } from './taxonomyApi';

export {
  fetchResource,
  createResource,
  queryResources,
  queryTopics,
  queryLearningPathResource,
} from './resources';
export {
  fetchAllResourceTypes,
  fetchResourceType,
  createResourceResourceType,
} from './resourcetypes';

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  updateSubject,
  addSubjectTopic,
} from './subjects';

export { addTopic, fetchTopic, addTopicToTopic, updateTopicMetadata } from './topics';
