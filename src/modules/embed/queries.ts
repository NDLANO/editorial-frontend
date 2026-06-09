/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IframeEmbedData, OembedEmbedData } from "@ndla/types-embed";
import { queryOptions, skipToken } from "@tanstack/react-query";
import { AUDIO_EMBED, BRIGHTCOVE_EMBED, IMAGE_EMBED } from "../../queryKeys";
import { fetchImage } from "../image/imageApi";
import {
  fetchAudioMeta,
  fetchBrightcoveMeta,
  fetchConceptVisualElement,
  fetchExternal,
  fetchH5pMeta,
} from "./embedApi";

export const brightcoveMetaQueryOptions = (resourceId: string, language: string) => {
  return queryOptions({
    queryKey: [BRIGHTCOVE_EMBED, resourceId],
    queryFn: () => fetchBrightcoveMeta(resourceId, language),
  });
};

export const audioMetaQueryOptions = (resourceId: string, language: string) => {
  return queryOptions({
    queryKey: [AUDIO_EMBED, resourceId, language],
    queryFn: () => fetchAudioMeta(resourceId, language),
  });
};

export const imageMetaQueryOptions = (resourceId: string, language: string) => {
  return queryOptions({
    queryKey: [IMAGE_EMBED, resourceId, language],
    queryFn: () => fetchImage(resourceId, language),
  });
};

export const h5pMetaQueryOptions = (path: string, url: string) => {
  return queryOptions({
    queryKey: ["h5pMeta", path, url],
    queryFn: () => fetchH5pMeta(path, url),
    retry: false,
  });
};

export const conceptVisualElementQueryOptions = (conceptId: number, visualElement: string, language: string) => {
  return queryOptions({
    queryKey: ["conceptVisualElement", conceptId, language],
    queryFn: () => fetchConceptVisualElement(visualElement, language),
    retry: false,
  });
};

export const externalEmbedQueryOptions = (
  embedData: OembedEmbedData | IframeEmbedData | undefined,
  language: string,
) => {
  return queryOptions({
    queryKey: ["externalEmbed", embedData?.url, embedData?.imageid, language],
    queryFn: embedData ? () => fetchExternal(embedData, language) : skipToken,
    retry: false,
  });
};
