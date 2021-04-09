/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { convertFieldWithFallback } from './convertFieldWithFallback';

export const transformAudio = audio => {
  const audioLanguage = audio?.supportedLanguages?.includes(audio.language)
    ? audio.language
    : undefined;

  return audio
    ? {
        ...audio,
        title: convertFieldWithFallback(audio, 'title', '', audioLanguage),
        tags: convertFieldWithFallback(audio, 'tags', [], audioLanguage),
      }
    : undefined;
};
