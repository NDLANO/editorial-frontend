/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';
import { TFunction } from 'react-i18next';
import { ResourceType } from '@ndla/types-taxonomy';
import {
  toEditArticle,
  toEditAudio,
  toEditConcept,
  toEditPodcastSeries,
  toLearningpathFull,
} from './routeHelpers';

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../constants';

const { contentTypes } = constants;

interface ContentTypeType {
  contentType: string;
}

const mapping: Record<string, ContentTypeType> = {
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

export const getResourceLanguages = (t: TFunction) => [
  { id: 'nb', name: t('language.nb') },
  { id: 'nn', name: t('language.nn') },
  { id: 'en', name: t('language.en') },
  { id: 'sma', name: t('language.sma') },
  { id: 'se', name: t('language.se') },
  { id: 'ukr', name: t('language.ukr') },
  { id: 'und', name: t('language.und') },
  { id: 'de', name: t('language.de') },
  { id: 'es', name: t('language.es') },
];

export const getContentTypeFromResourceTypes = (
  resourceTypes: Pick<ResourceType, 'id'>[],
): ContentTypeType => {
  const resourceType = resourceTypes.find((type) => !!mapping[type.id]);
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
    contexts?: { learningResourceType: string }[];
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

  const foundSupportedLanguage = content.supportedLanguages?.find((l) => l === locale);
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
