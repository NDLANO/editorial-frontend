/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { queryOptions } from "@tanstack/react-query";
import { LEARNINGPATH, LEARNINGPATH_TAGS, LEARNINGPATHS_WITH_ARTICLE } from "../../queryKeys";
import {
  fetchLearningpath,
  fetchLearningpathsWithArticle,
  fetchLearningpathTags,
  fetchLearningStepSamples,
} from "./learningpathApi";

export const learningpathQueryKeys = {
  learningpath: ({ id, ...params }: UseLearningpath) => [LEARNINGPATH, id, params],
  learningpathTags: (params: UseLearningpathTags) => [LEARNINGPATH_TAGS, params],
  containingArticle: (id: number) => [LEARNINGPATHS_WITH_ARTICLE, id],
};

interface UseLearningpath {
  id: number;
  language?: string;
}

export const learningpathQueryOptions = (params: UseLearningpath) => {
  return queryOptions({
    queryKey: learningpathQueryKeys.learningpath(params),
    queryFn: () => fetchLearningpath(params.id, params.language),
  });
};

interface UseLearningpathTags {
  language?: string;
  fallback?: boolean;
}

export const learningpathTagsQueryOptions = (params: UseLearningpathTags = {}) => {
  return queryOptions({
    queryKey: learningpathQueryKeys.learningpathTags(params),
    queryFn: () => fetchLearningpathTags(params.language, params.fallback),
  });
};

export const learningpathsWithArticleQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: learningpathQueryKeys.containingArticle(id),
    queryFn: () => fetchLearningpathsWithArticle(id),
  });
};

export const learningStepSamplesQueryOptions = () => {
  return queryOptions({
    queryKey: ["learningpath-step-samples"],
    queryFn: () => fetchLearningStepSamples(),
  });
};
