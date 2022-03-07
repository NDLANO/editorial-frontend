/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { IAudioSummary, ISeriesSummary } from '@ndla/types-audio-api';
import { IConceptSummary } from '@ndla/types-concept-api';
import { IImageMetaSummary } from '@ndla/types-image-api';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import SearchContent from './SearchContent';
import SearchConcept from './SearchConcept';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';
import SearchPodcastSeries from './SearchPodcastSeries';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { LocaleType, ReturnType } from '../../../../interfaces';

type ContentReturnType = ReturnType<'content', IMultiSearchSummary>;
type ConceptReturnType = ReturnType<'concept', IConceptSummary>;
type ImageReturnType = ReturnType<'image', IImageMetaSummary>;
type AudioReturnType = ReturnType<'audio', IAudioSummary>;
type PodcastReturnType = ReturnType<'podcast-series', ISeriesSummary>;
type MissingReturnType = ReturnType<string, any>;
export type SearchResultReturnType =
  | MissingReturnType
  | ContentReturnType
  | ConceptReturnType
  | ImageReturnType
  | AudioReturnType
  | PodcastReturnType;

interface Props {
  result: SearchResultReturnType;
  locale: string;
  subjects: SubjectType[];
  editingState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const SearchResult = ({ result, locale, subjects, editingState }: Props) => {
  const { t } = useTranslation();
  switch (result.type) {
    case 'content':
      return <SearchContent content={result.value} locale={locale} />;
    case 'concept':
      return (
        <SearchConcept
          concept={result.value}
          locale={locale as LocaleType}
          subjects={subjects}
          editingState={editingState}
        />
      );
    case 'image':
      return <SearchImage image={result.value} locale={locale} />;
    case 'audio':
      return <SearchAudio audio={result.value} locale={locale} />;
    case 'podcast-series':
      return <SearchPodcastSeries series={result.value} />;
    default:
      return <p>{t('searchForm.resultError', { type: result.type })}</p>;
  }
};

export default SearchResult;
