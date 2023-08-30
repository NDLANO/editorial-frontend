/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioEmbedData, AudioMeta } from '@ndla/types-embed';
import { IImageMetaInformationV3 } from '@ndla/types-backend/build/image-api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { fetchAudio } from '../audio/audioApi';
import { fetchImage } from '../image/imageApi';

const fetchMeta = async (embed: AudioEmbedData): Promise<AudioMeta> => {
  const audio = await fetchAudio(parseInt(embed.resourceId));
  let image: IImageMetaInformationV3 | undefined;
  if (audio.podcastMeta?.coverPhoto.id) {
    image = await fetchImage(audio.podcastMeta?.coverPhoto.id);
  }

  return {
    ...audio,
    imageMeta: image,
  };
};

export const useAudioMeta = (embed: AudioEmbedData, options?: UseQueryOptions<AudioMeta>) => {
  return useQuery<AudioMeta>(['audio', embed.resourceId], () => fetchMeta(embed), options);
};
