/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { LEARNINGPATH } from "../../queryKeys";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { fetchLearningpath } from "./learningpathApi";

export const learningpathQueryKeys = {
  learningpath: (params: UseLearningpath) => [LEARNINGPATH, params],
};

interface UseLearningpath {
  id: number;
  language?: string;
}

export const useLearningpath = (params: UseLearningpath, options?: Partial<UseQueryOptions<ILearningPathV2DTO>>) => {
  return useQuery<ILearningPathV2DTO>({
    queryKey: learningpathQueryKeys.learningpath(params),
    queryFn: () => fetchLearningpath(params.id, params.language),
    ...options,
  });
};
