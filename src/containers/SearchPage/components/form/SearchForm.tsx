/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import SearchContentForm from './SearchContentForm';
import SearchAudioForm from './SearchAudioForm';
import SearchPodcastSeriesForm from './SearchPodcastSeriesForm';
import SearchImageForm from './SearchImageForm';
import SearchConceptForm from './SearchConceptForm';
import { SubjectType } from '../../../../interfaces';
import { SearchParamsShape } from '../../../../shapes';

export const searchFormClasses = new BEMHelper({
  name: 'search-form',
  prefix: 'c-',
});

export interface SearchParams {
  query?: string | null;
  'draft-status'?: string | null;
  'include-other-statuses'?: boolean;
  'page-size'?: string | null;
  'resource-types'?: string | null;
  'audio-type'?: string | null;
  fallback?: boolean | null;
  language?: string | null;
  page?: string | null;
  status?: string | null;
  subjects?: string | null;
  users?: string | null;
}

interface Props {
  type: string;
  searchObject: SearchParams;
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  location: Location;
  locale: string;
}

const SearchForm = ({ type, searchObject, ...rest }: Props) => {
  switch (type) {
    case 'content':
      return <SearchContentForm searchObject={searchObject} {...rest} />;
    case 'audio':
      return <SearchAudioForm searchObject={searchObject} {...rest} />;
    case 'image':
      return <SearchImageForm searchObject={searchObject} {...rest} />;
    case 'concept':
      return <SearchConceptForm searchObject={searchObject} {...rest} />;
    case 'podcast-series':
      return <SearchPodcastSeriesForm searchObject={searchObject} {...rest} />;
    default:
      return <p>{`This type: ${type} is not supported`}</p>;
  }
};

SearchForm.propTypes = {
  type: PropTypes.string.isRequired,
  searchObject: SearchParamsShape,
};

export default SearchForm;
