/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AudioMeta, ConceptListData, ConceptVisualElementMeta } from '@ndla/types-embed';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { AUDIO_EMBED } from '../../queryKeys';
import { fetchAudioMeta, fetchConceptListMeta, fetchConceptVisualElement } from './embedApi';

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
