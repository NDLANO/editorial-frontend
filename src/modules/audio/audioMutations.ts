/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultError, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postAudioTranscription } from "./audioApi";
import { PostAudioTranscription } from "./audioTypes";

export const usePostAudioTranscriptionMutation = (
  options?: Partial<UseMutationOptions<string, DefaultError, PostAudioTranscription>>,
) => {
  return useMutation<string, DefaultError, PostAudioTranscription>({
    mutationFn: (params) => postAudioTranscription(params.name, params.id, params.language),
    ...options,
  });
};
