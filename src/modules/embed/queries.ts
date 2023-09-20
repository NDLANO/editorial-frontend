/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioMeta, H5pData } from '@ndla/types-embed';
import { IImageMetaInformationV3 } from '@ndla/types-backend/build/image-api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { fetchAudio } from '../audio/audioApi';
import { fetchImage } from '../image/imageApi';
import { AUDIO_EMBED, H5P_EMBED } from '../../queryKeys';
import { fetchH5PInfo, fetchH5pLicenseInformation } from '../../components/H5PElement/h5pApi';
import { fetchH5pOembed } from '../../util/apiHelpers';

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
    { ...options, retry: false },
  );
};

export const fetchH5pMeta = async (url: string): Promise<H5pData> => {
  const pathArr = url.split('/') || [];
  const h5pId = pathArr[pathArr.length - 1];
  const [oembedData, h5pLicenseInformation, h5pInfo] = await Promise.all([
    fetchH5pOembed(url),
    fetchH5pLicenseInformation(h5pId),
    fetchH5PInfo(h5pId),
  ]);

  return {
    h5pLicenseInformation: {
      h5p: {
        ...h5pLicenseInformation?.h5p,
        authors: h5pLicenseInformation?.h5p.authors ?? [],
        title: h5pInfo?.title ?? '',
      },
    },
    h5pUrl: url,
    oembed: oembedData,
  };
};

export const useH5pMeta = (url: string, options?: UseQueryOptions<H5pData>) => {
  return useQuery<H5pData>([H5P_EMBED, url], () => fetchH5pMeta(url), { ...options, retry: false });
};
