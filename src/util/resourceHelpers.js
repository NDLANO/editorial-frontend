/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';
import config from '../config';
import { toEditArticle } from './routeHelpers';

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../constants';

const { contentTypes } = constants;

const mapping = {
  [RESOURCE_TYPE_LEARNING_PATH]: {
    contentType: contentTypes.LEARNING_PATH,
  },
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
    contentType: contentTypes.SUBJECT_MATERIAL,
  },
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
    contentType: contentTypes.TASKS_AND_ACTIVITIES,
  },
  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: {
    contentType: contentTypes.ASSESSMENT_RESOURCES,
  },
  [RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES]: {
    contentType: contentTypes.EXTERNAL_LEARNING_RESOURCES,
  },
  [RESOURCE_TYPE_SOURCE_MATERIAL]: {
    contentType: contentTypes.SOURCE_MATERIAL,
  },
  default: {
    contentType: contentTypes.SUBJECT_MATERIAL,
  },
};

export const getResourceLanguages = t => [
  { id: 'nb', name: t('language.nb') },
  { id: 'nn', name: t('language.nn') },
  { id: 'en', name: t('language.en') },
  { id: 'sma', name: t('language.sma') },
  { id: 'unknown', name: t('language.unknown') },
];

export const getContentTypeFromResourceTypes = resourceTypes => {
  const resourceType = resourceTypes.find(type => mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};

const isLearningPathResourceType = contentType =>
  contentType === contentTypes.LEARNING_PATH;

export const resourceToLinkProps = (content, contentType, locale) => {
  if (isLearningPathResourceType(contentType)) {
    return {
      href: `${config.learningpathFrontendDomain}/${locale}/learningpaths/${content.id}/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return {
    to: toEditArticle(
      content.id,
      content.contexts &&
        content.contexts.length > 0 &&
        content.contexts[0].learningResourceType
        ? content.contexts[0].learningResourceType
        : 'standard',
      locale,
    ),
  };
};
