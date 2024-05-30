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

const isLearningPathResourceType = (contentType?: string) => contentType === contentTypes.LEARNING_PATH;

const isConceptType = (contentType?: string) => contentType === "concept";
const isGlossType = (contentType?: string) => contentType === "gloss";
const isAudioType = (contentType?: string) => contentType === "audio";
const isSeriesType = (contentType?: string) => contentType === "series";

export const resourceToLinkProps = (
  content: {
    id: number;
    supportedLanguages?: string[];
    contexts?: { contextType: string }[];
  },
  contentType: string | undefined,
  locale: string,
) => {
  const foundSupportedLanguage = content.supportedLanguages?.find((l) => l === locale);
  const languageOrDefault = foundSupportedLanguage ?? content.supportedLanguages?.[0] ?? "nb";

  // Only tax-types have contexts
  if (!content.contexts) {
    if (isConceptType(contentType)) {
      return {
        to: toEditConcept(content.id, languageOrDefault),
      };
    }
    if (isGlossType(contentType)) {
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
  }

  if (isLearningPathResourceType(contentType)) {
    return {
      href: toLearningpathFull(content.id, locale),
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return {
    to: toEditArticle(content.id, content?.contexts?.[0]?.contextType || "standard", languageOrDefault),
  };
};
