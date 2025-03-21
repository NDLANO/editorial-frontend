/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postAudioTranscription } from "./audioApi";
import { PostAudioTranscription } from "./audioTypes";

export const usePostAudioTranscription = (options?: Partial<UseMutationOptions<void, any, PostAudioTranscription>>) => {
  return useMutation<void, any, PostAudioTranscription>({
    mutationFn: (params) => postAudioTranscription(params.name, params.id, params.language),
    ...options,
  });
};
