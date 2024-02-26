/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Node } from "@ndla/types-taxonomy";
import {
  toEditAudio,
  toEditConcept,
  toEditFrontPageArticle,
  toEditGloss,
  toEditImage,
  toEditLearningResource,
  toEditPodcast,
  toEditPodcastSeries,
  toEditTopicArticle,
} from "../../util/routeHelpers";

export const getTaxonomyPathsFromTaxonomy = (taxonomy?: Pick<Node, "paths">[], articleId?: number): string[] => {
  const taxPaths = taxonomy?.flatMap((t) => t.paths) ?? [];
  const articlePath = articleId ? `/article/${articleId}` : undefined;
  const paths = articlePath ? taxPaths.concat(articlePath) : taxPaths;
  return paths.filter((p): p is string => p !== undefined);
};

export const toMapping = {
  concept: toEditConcept,
  gloss: toEditGloss,
  audio: toEditAudio,
  "podcast-series": toEditPodcastSeries,
  podcast: toEditPodcast,
  image: toEditImage,
  "frontpage-article": toEditFrontPageArticle,
  standard: toEditLearningResource,
  "topic-article": toEditTopicArticle,
};

export type TranslatableType = keyof typeof toMapping;

export const translatableTypes: TranslatableType[] = [
  "audio",
  "concept",
  "gloss",
  "standard",
  "topic-article",
  "podcast",
  "image",
  "podcast-series",
  "frontpage-article",
];

export const createEditUrl = (id: number, locale: string, type: keyof typeof toMapping) => {
  return toMapping[type](id, locale);
};
