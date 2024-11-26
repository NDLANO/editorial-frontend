/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import {
  AudioMeta,
  BrightcoveData,
  ConceptVisualElementMeta,
  H5pData,
  IframeData,
  IframeEmbedData,
  OembedData,
  OembedEmbedData,
} from "@ndla/types-embed";
import {
  fetchAudioMeta,
  fetchBrightcoveMeta,
  fetchConceptVisualElement,
  fetchExternal,
  fetchH5pMeta,
} from "./embedApi";
import { AUDIO_EMBED, BRIGHTCOVE_EMBED, IMAGE_EMBED } from "../../queryKeys";
import { fetchImage } from "../image/imageApi";

export const useBrightcoveMeta = (
  resourceId: string,
  language: string,
  options?: Partial<UseQueryOptions<BrightcoveData>>,
) => {
  return useQuery<BrightcoveData>({
    queryKey: [BRIGHTCOVE_EMBED, resourceId],
    queryFn: () => fetchBrightcoveMeta(resourceId, language),
    ...options,
  });
};

export const useAudioMeta = (resourceId: string, language: string, options?: Partial<UseQueryOptions<AudioMeta>>) => {
  return useQuery<AudioMeta>({
    queryKey: [AUDIO_EMBED, resourceId, language],
    queryFn: () => fetchAudioMeta(resourceId, language),
    ...options,
  });
};

export const useImageMeta = (
  resourceId: string,
  language: string,
  options?: Partial<UseQueryOptions<IImageMetaInformationV3>>,
) => {
  return useQuery<IImageMetaInformationV3>({
    queryKey: [IMAGE_EMBED, resourceId, language],
    queryFn: () => fetchImage(resourceId, language),
    ...options,
  });
};

export const useH5pMeta = (path: string, url: string, options?: Partial<UseQueryOptions<H5pData>>) => {
  return useQuery<H5pData>({
    retry: false,
    queryKey: ["h5pMeta", path, url],
    queryFn: () => fetchH5pMeta(path, url),
    ...options,
  });
};

export const useConceptVisualElement = (
  conceptId: number,
  visualElement: string,
  language: string,
  options?: Partial<UseQueryOptions<ConceptVisualElementMeta | undefined>>,
) => {
  return useQuery<ConceptVisualElementMeta | undefined>({
    retry: false,
    queryKey: ["conceptVisualElement", conceptId, language],
    queryFn: () => fetchConceptVisualElement(visualElement, language),
    ...options,
  });
};

export const useExternalEmbed = (
  embedData: OembedEmbedData | IframeEmbedData,
  language: string,
  options?: Partial<UseQueryOptions<IframeData | OembedData>>,
) => {
  return useQuery<IframeData | OembedData>({
    retry: false,
    queryKey: ["externalEmbed", embedData?.url, embedData?.imageid, language],
    queryFn: () => fetchExternal(embedData, language),
    ...options,
  });
};
