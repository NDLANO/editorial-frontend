/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioMeta } from '@ndla/types-embed';
import { IImageMetaInformationV3 } from '@ndla/types-backend/build/image-api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { fetchAudio } from '../audio/audioApi';
import { fetchImage } from '../image/imageApi';
import { AUDIO_EMBED } from '../../queryKeys';

const fetchMeta = async (resourceId: string, language: string): Promise<AudioMeta> => {
  const audio = await fetchAudio(parseInt(resourceId), language);
  let image: IImageMetaInformationV3 | undefined;
  if (audio.podcastMeta?.coverPhoto.id) {
    image = await fetchImage(audio.podcastMeta?.coverPhoto.id, language);
  }

  return {
    ...audio,
    imageMeta: image,
  };
};

export const useAudioMeta = (
  resourceId: string,
  language: string,
  options?: UseQueryOptions<AudioMeta>,
) => {
  return useQuery<AudioMeta>(
    [AUDIO_EMBED, resourceId, language],
    () => fetchMeta(resourceId, language),
    options,
  );
};
