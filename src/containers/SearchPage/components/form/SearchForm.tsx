/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import SearchContentForm from './SearchContentForm';
import SearchAudioForm from './SearchAudioForm';
import SearchPodcastSeriesForm from './SearchPodcastSeriesForm';
import SearchImageForm from './SearchImageForm';
import SearchConceptForm from './SearchConceptForm';
import { SearchType } from '../../../../interfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { datePickerTypes } from './GenericSearchForm';
import formatDate from '../../../../util/formatDate';

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
  'revision-date-from'?: string;
  'revision-date-to'?: string;
}

export const searchParamsFormatter = (
  key: keyof SearchParams,
  value?: string | number | boolean,
): string | number | boolean | undefined => {
  if (datePickerTypes.includes(key) && typeof value === 'string') {
    return formatDate(value);
  }
  return value;
};

export const parseSearchParams = (locationSearch: string): SearchParams => {
  const queryStringObject: Record<string, string | undefined> = queryString.parse(locationSearch);
  return {
    query: queryStringObject.query,
    'draft-status': queryStringObject['draft-status'],
    'include-other-statuses':
      queryStringObject['include-other-statuses'] !== undefined
        ? queryStringObject['include-other-statuses'] === 'true'
        : undefined,
    'resource-types': queryStringObject['resource-types'],
    'audio-type': queryStringObject['audio-type'],
    'model-released': queryStringObject['model-released'],
    fallback: queryStringObject.fallback ? queryStringObject.fallback === 'true' : undefined,
    language: queryStringObject.language,
    license: queryStringObject.license,
    page: queryStringObject.page ? parseInt(queryStringObject.page, 10) : undefined,
    'page-size': queryStringObject['page-size']
      ? parseInt(queryStringObject['page-size'], 10)
      : undefined,
    sort: queryStringObject.sort,
    status: queryStringObject.status,
    subjects: queryStringObject.subjects,
    type: queryStringObject.type,
    users: queryStringObject.users,
    'revision-date-from': queryStringObject['revision-date-from'],
    'revision-date-to': queryStringObject['revision-date-to'],
  };
};

interface Props {
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

export default SearchForm;
