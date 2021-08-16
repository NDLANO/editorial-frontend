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

const SearchResult = ({
  result,
  locale,
  type,
  subjects,
  userAccess,
  editingState,
  licenses,
}) => {
  const {t} = useTranslation();
  switch (type) {
    case 'content':
      return <SearchContent content={result} locale={locale} userAccess={userAccess} />;
    case 'concept':
      return (
        <SearchConcept
          concept={result}
          locale={locale}
          subjects={subjects}
          editingState={editingState}
          licenses={licenses}
        />
      );
    case 'image':
      return <SearchImage image={result} locale={locale} licenses={licenses} />;
    case 'audio':
      return <SearchAudio audio={result} locale={locale} licenses={licenses} />;
    case 'podcast-series':
      return <SearchPodcastSeries series={result} locale={locale} licenses={licenses} />;
    default:
      return <p>{t('searchForm.resultError', { type })}</p>;
  }
};

SearchResult.propTypes = {
  result: PropTypes.oneOfType([ContentResultShape, ImageResultShape, AudioResultShape]),
  type: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  subjects: PropTypes.array,
  userAccess: PropTypes.string,
  editingState: PropTypes.array,
  licenses: PropTypes.array,
};

export default SearchResult;
