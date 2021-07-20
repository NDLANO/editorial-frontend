/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';
import { tType } from '@ndla/i18n';
import { toEditArticle, toEditAudio, toEditConcept, toEditPodcastSeries, toLearningpathFull } from './routeHelpers';

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../constants';
import { ResourceType } from '../interfaces';

const { contentTypes } = constants;

interface ContentType {
  contentType: string;
}

const mapping: Record<string, ContentType> = {
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

export const getResourceLanguages = (t: tType['t']) => [
  { id: 'nb', name: t('language.nb') },
  { id: 'nn', name: t('language.nn') },
  { id: 'en', name: t('language.en') },
  { id: 'sma', name: t('language.sma') },
  { id: 'unknown', name: t('language.unknown') },
];

export const getContentTypeFromResourceTypes = (resourceTypes: ResourceType[]): ContentType => {
  const resourceType = resourceTypes.find(type => !!mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};

const isLearningPathResourceType = (contentType?: string) =>
  contentType === contentTypes.LEARNING_PATH;

const isConceptType = (contentType?: string) => contentType === 'concept';
const isAudioType = (contentType?: string) => contentType === 'audio';
const isSeriesType = (contentType?: string) => contentType === 'series';

export const resourceToLinkProps = (
  content: {
    id: number;
    supportedLanguages?: string[];
    contexts: [{ learningResourceType: string }];
  },
  contentType: string | undefined,
  locale: string,
) => {
  if (isLearningPathResourceType(contentType)) {
    return {
      href: toLearningpathFull(content.id, locale),
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  const foundSupportedLanguage = content.supportedLanguages?.find(l => l === locale);
  const languageOrDefault = foundSupportedLanguage ?? content.supportedLanguages?.[0] ?? 'nb';

  if (isConceptType(contentType)) {
    return {
      to: toEditConcept(content.id, languageOrDefault),
    };
  }
  if (isAudioType(contentType)) {
    return {
      to: toEditAudio(content.id, languageOrDefault),
    };
  }

if (isSeriesType(contentType)) {
  return {
    to: toEditPodcastSeries(content.id, languageOrDefault),
  };
}

  return {
    to: toEditArticle(
      content.id,
      content?.contexts?.[0]?.learningResourceType || 'standard',
      languageOrDefault,
    ),
  };
};
