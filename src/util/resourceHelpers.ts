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

const { contentTypes, contentTypeMapping } = constants;

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

export const getContentTypeFromResourceTypes = (resourceTypes: Pick<ResourceType, "id">[]): string => {
  const resourceType = resourceTypes.find((type) => !!contentTypeMapping[type.id]);
  if (resourceType) {
    return contentTypeMapping[resourceType.id];
  }
  return contentTypeMapping.default;
};

const isLearningPathResourceType = (contentType?: string) =>
  contentType === "learningpath" || contentType === contentTypes.LEARNING_PATH;
const isConceptType = (contentType: string | undefined) => contentType === "concept";
const isGlossType = (contentType: string | undefined) => contentType === "gloss";
const isAudioType = (contentType: string | undefined) => contentType === "audio";
const isSeriesType = (contentType: string | undefined) => contentType === "series";

export interface ResourceToLinkContent {
  id: number | string;
  supportedLanguages?: string[];
  learningResourceType?: string;
}

export const resourceToLinkProps = (
  content: ResourceToLinkContent,
  contentType: string | undefined,
  locale: string,
) => {
  const foundSupportedLanguage = content.supportedLanguages?.find((l) => l === locale);
  const languageOrDefault = foundSupportedLanguage ?? content.supportedLanguages?.[0] ?? "nb";

  if (isConceptType(content.learningResourceType)) {
    return {
      to: toEditConcept(content.id, languageOrDefault),
    };
  }
  if (isGlossType(content.learningResourceType)) {
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
  if (isLearningPathResourceType(contentType)) {
    return {
      href: toLearningpathFull(content.id, locale),
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }
  return {
    to: toEditArticle(content.id, content.learningResourceType ?? "standard", languageOrDefault),
  };
};
