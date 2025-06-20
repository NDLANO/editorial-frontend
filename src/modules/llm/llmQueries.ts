/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@tanstack/react-query";
import { fetchDefaultAiPrompts } from "./llmApi";
import { PromptType } from "../../interfaces";

export const useDefaultAiPrompts = (type: PromptType, language: string) =>
  useQuery({
    queryKey: [type, language],
    queryFn: () => fetchDefaultAiPrompts(type, language),
  });
