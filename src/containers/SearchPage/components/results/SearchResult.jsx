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

const SearchResult = ({ result, locale, type, subjects, editingState }) => {
  const { t } = useTranslation();
  switch (type) {
    case 'content':
      return <SearchContent content={result} locale={locale} />;
    case 'concept':
      return (
        <SearchConcept
          concept={result}
          locale={locale}
          subjects={subjects}
          editingState={editingState}
        />
      );
    case 'image':
      return <SearchImage image={result} locale={locale} />;
    case 'audio':
      return <SearchAudio audio={result} locale={locale} />;
    case 'podcast-series':
      return <SearchPodcastSeries series={result} locale={locale} />;
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
