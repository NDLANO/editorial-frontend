/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ContentResultShape, ImageResultShape, AudioResultShape } from '../../../../shapes';
import SearchContent from './SearchContent';
import SearchConcept from './SearchConcept';
import SearchImage from './SearchImage';
import SearchAudio from './SearchAudio';
import SearchPodcastSeries from './SearchPodcastSeries';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { ResultSummaryType } from './SearchList';
import { ImageSearchSummaryApiType } from '../../../../modules/image/imageApiInterfaces';
import {
  AudioSearchResultType,
  SeriesSearchResultType,
} from '../../../../modules/audio/audioApiInterfaces';
import { SearchConceptType } from '../../../../modules/concept/conceptApiInterfaces';
import { MultiSearchSummary } from '../../../../modules/search/searchApiInterfaces';
import { LocaleType } from '../../../../interfaces';

interface Props {
  result: ResultSummaryType;
  type: string;
  locale: string;
  subjects: SubjectType[];
  editingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const SearchResult = ({ result, locale, type, subjects, editingState }: Props) => {
  const { t } = useTranslation();
  switch (type) {
    case 'content':
      return <SearchContent content={result as MultiSearchSummary} locale={locale} />;
    case 'concept':
      return (
        <SearchConcept
          concept={result as SearchConceptType}
          locale={locale as LocaleType}
          subjects={subjects}
          editingState={editingState}
        />
      );
    case 'image':
      return <SearchImage image={result as ImageSearchSummaryApiType} locale={locale} />;
    case 'audio':
      return <SearchAudio audio={result as AudioSearchResultType} locale={locale} />;
    case 'podcast-series':
      return <SearchPodcastSeries series={result as SeriesSearchResultType} />;
    default:
      return <p>{t('searchForm.resultError', { type })}</p>;
  }
};

SearchResult.propTypes = {
  result: PropTypes.oneOfType([ContentResultShape, ImageResultShape, AudioResultShape]),
  type: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  subjects: PropTypes.array,
  editingState: PropTypes.array,
};

export default SearchResult;
