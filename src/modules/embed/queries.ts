/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioMeta, ConceptListData, ConceptVisualElementMeta, H5pData } from '@ndla/types-embed';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { AUDIO_EMBED } from '../../queryKeys';
import {
  fetchAudioMeta,
  fetchConceptListMeta,
  fetchConceptVisualElement,
  fetchH5pMeta,
} from './embedApi';

export const useAudioMeta = (
  resourceId: string,
  language: string,
  options?: UseQueryOptions<AudioMeta>,
) => {
  return useQuery<AudioMeta>(
    [AUDIO_EMBED, resourceId, language],
    () => fetchAudioMeta(resourceId, language),
    options,
  );
};

export const useH5pMeta = (path: string, url: string, options?: UseQueryOptions<H5pData>) => {
  return useQuery<H5pData>(['h5pMeta', path, url], () => fetchH5pMeta(path, url), {
    ...options,
    retry: false,
  });
};

export const useConceptVisualElement = (
  conceptId: number,
  visualElement: string,
  language: string,
  options?: UseQueryOptions<ConceptVisualElementMeta | undefined>,
) => {
  return useQuery<ConceptVisualElementMeta | undefined>(
    ['conceptVisualElement', conceptId, language],
    () => fetchConceptVisualElement(visualElement, language),
    {
      ...options,
      retry: false,
    },
  );
};

export const useConceptListMeta = (
  tag: string,
  subject: string | undefined,
  language: string,
  concepts: IConceptSummary[],
  options?: UseQueryOptions<ConceptListData>,
) => {
  return useQuery<ConceptListData>(
    ['conceptListMeta', tag, subject],
    () => fetchConceptListMeta(concepts, language),
    { ...options, retry: false },
  );
};
