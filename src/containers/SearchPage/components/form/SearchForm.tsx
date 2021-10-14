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
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import SearchContentForm from './SearchContentForm';
import SearchAudioForm from './SearchAudioForm';
import SearchPodcastSeriesForm from './SearchPodcastSeriesForm';
import SearchImageForm from './SearchImageForm';
import SearchConceptForm from './SearchConceptForm';
import { SearchType } from '../../../../interfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { SearchParamsShape } from '../../../../shapes';
import { SearchTypeValues } from '../../../../constants';

export const searchFormClasses = new BEMHelper({
  name: 'search-form',
  prefix: 'c-',
});

export interface SearchParams {
  query?: string;
  'draft-status'?: string;
  'include-other-statuses'?: boolean;
  'resource-types'?: string;
  'audio-type'?: string;
  fallback?: boolean;
  language?: string;
  page?: number;
  'page-size'?: number;
  status?: string;
  subjects?: string;
  users?: string;
  sort?: string;
  type?: string;
  license?: string;
  'model-released'?: string;
}

export const parseSearchParams = (locationSearch: string): SearchParams => {
  const queryStringObject: Record<string, string | undefined> = queryString.parse(locationSearch);
  return {
    'audio-type': queryStringObject['audio-type'],
    'draft-status': queryStringObject['draft-status'],
    fallback: queryStringObject.fallback === 'true',
    'include-other-statuses': queryStringObject['include-other-statuses'] === 'true',
    language: queryStringObject.language,
    license: queryStringObject.license,
    'model-released': queryStringObject['model-released'],
    page: queryStringObject.page ? parseInt(queryStringObject.page, 10) : undefined,
    'page-size': queryStringObject['page-size']
      ? parseInt(queryStringObject['page-size'], 10)
      : undefined,
    query: queryStringObject.query,
    'resource-types': queryStringObject['resource-types'],
    sort: queryStringObject.sort,
    status: queryStringObject.status,
    subjects: queryStringObject.subjects,
    type: queryStringObject.type,
    users: queryStringObject.users,
  };
};

interface Props extends RouteComponentProps {
  type: SearchType;
  searchObject: SearchParams;
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
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
  type: PropTypes.oneOf(SearchTypeValues).isRequired,
  searchObject: SearchParamsShape,
  search: PropTypes.func.isRequired,
  subjects: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
};

export default withRouter(SearchForm);
