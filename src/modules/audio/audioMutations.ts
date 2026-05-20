/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mutationOptions } from "@tanstack/react-query";
import { postAudioTranscription } from "./audioApi";
import { PostAudioTranscription } from "./audioTypes";

export const postAudioTranscriptionMutationOptions = () => {
  return mutationOptions({
    mutationFn: (params: PostAudioTranscription) => postAudioTranscription(params.name, params.id, params.language),
  });
};
