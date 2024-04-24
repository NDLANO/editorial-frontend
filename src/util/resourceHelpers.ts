/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { ResourceType } from "@ndla/types-taxonomy";
import { constants } from "@ndla/ui";
import {
  toEditArticle,
  toEditAudio,
  toEditConcept,
  toEditGloss,
  toEditPodcastSeries,
  toLearningpathFull,
} from "./routeHelpers";

import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_CONCEPT,
} from "../constants";

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
  [RESOURCE_TYPE_CONCEPT]: {
    contentType: contentTypes.CONCEPT,
  },
  [RESOURCE_TYPE_SOURCE_MATERIAL]: {
    contentType: contentTypes.SOURCE_MATERIAL,
  },
  default: {
    contentType: contentTypes.SUBJECT_MATERIAL,
  },
};

export const getResourceLanguages = (t: TFunction) => [
  { id: "nb", name: t("languages.nb") },
  { id: "nn", name: t("languages.nn") },
  { id: "en", name: t("languages.en") },
  { id: "sma", name: t("languages.sma") },
  { id: "se", name: t("languages.se") },
  { id: "ukr", name: t("languages.ukr") },
  { id: "und", name: t("languages.und") },
  { id: "de", name: t("languages.de") },
  { id: "es", name: t("languages.es") },
  { id: "zh", name: t("languages.zh") },
];

export const getContentTypeFromResourceTypes = (resourceTypes: Pick<ResourceType, "id">[]): ContentTypeType => {
  const resourceType = resourceTypes.find((type) => !!mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};

const isLearningPathResourceType = (contentType?: string) => contentType === contentTypes.LEARNING_PATH;

const isConceptType = (contentType: string | undefined, learningResourceType: string | undefined) =>
  contentType === "concept" || learningResourceType === "concept";
const isGlossType = (contentType: string | undefined, learningResourceType: string | undefined) =>
  contentType === "gloss" || learningResourceType === "gloss";
const isAudioType = (contentType: string | undefined) => contentType === "audio";
const isSeriesType = (contentType: string | undefined) => contentType === "series";

export const resourceToLinkProps = (
  content: {
    id: number;
    supportedLanguages?: string[];
    learningResourceType?: string;
    contexts?: { contextType: string }[];
  },
  contentType: string | undefined,
  locale: string,
) => {
  if (isLearningPathResourceType(contentType)) {
    return {
      href: toLearningpathFull(content.id, locale),
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  const foundSupportedLanguage = content.supportedLanguages?.find((l) => l === locale);
  const languageOrDefault = foundSupportedLanguage ?? content.supportedLanguages?.[0] ?? "nb";

  if (isConceptType(contentType, content.learningResourceType)) {
    return {
      to: toEditConcept(content.id, languageOrDefault),
    };
  }
  if (isGlossType(contentType, content.learningResourceType)) {
    return {
      to: toEditGloss(content.id, languageOrDefault),
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
    to: toEditArticle(content.id, content.learningResourceType ?? "standard", languageOrDefault),
  };
};
