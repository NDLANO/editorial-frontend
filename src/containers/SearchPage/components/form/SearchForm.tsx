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
  subjects?: string | null;
  'resource-types'?: string | null;
  'draft-status'?: string | null;
  users?: string | null;
  language?: string | null;
  fallback?: boolean | null;
  page?: string | null;
  'page-size'?: string | null;
  status?: string | null;
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
    default:
      return <p>{`This type: ${type} is not supported`}</p>;
  }
};

SearchForm.propTypes = {
  type: PropTypes.string.isRequired,
  searchObject: SearchParamsShape,
};

export default SearchForm;
