/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { Node } from '@ndla/types-taxonomy';
import SearchContentForm from './SearchContentForm';
import SearchAudioForm from './SearchAudioForm';
import SearchPodcastSeriesForm from './SearchPodcastSeriesForm';
import SearchImageForm from './SearchImageForm';
import SearchConceptForm from './SearchConceptForm';
import { SearchType } from '../../../../interfaces';

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
  'exclude-revision-log'?: boolean | undefined;
  'responsible-ids'?: string;
  'filter-inactive'?: boolean;
  'concept-type'?: string;
}

export const parseSearchParams = (locationSearch: string): SearchParams => {
  const queryStringObject: Record<string, string | undefined> = queryString.parse(locationSearch);

  const parseBooleanParam = (key: string, fallback = false): boolean => {
    const value = queryStringObject[key];
    if (!value) return fallback;
    return value === 'true';
  };

  const parseNumberParam = (key: string): number | undefined => {
    const value = queryStringObject[key];
    if (!value) return undefined;
    return parseInt(value, 10);
  };

  return {
    query: queryStringObject.query,
    'draft-status': queryStringObject['draft-status'],
    'include-other-statuses': parseBooleanParam('include-other-statuses'),
    'resource-types': queryStringObject['resource-types'],
    'audio-type': queryStringObject['audio-type'],
    'model-released': queryStringObject['model-released'],
    fallback: parseBooleanParam('fallback'),
    language: queryStringObject.language,
    license: queryStringObject.license,
    page: parseNumberParam('page'),
    'page-size': parseNumberParam('page-size'),
    sort: queryStringObject.sort,
    status: queryStringObject.status,
    subjects: queryStringObject.subjects,
    type: queryStringObject.type,
    users: queryStringObject.users,
    'revision-date-from': queryStringObject['revision-date-from'],
    'revision-date-to': queryStringObject['revision-date-to'],
    'exclude-revision-log': parseBooleanParam('exclude-revision-log'),
    'responsible-ids': queryStringObject['responsible-ids'],
    'filter-inactive': parseBooleanParam('filter-inactive', true),
    'concept-type': queryStringObject['concept-type'],
  };
};

interface Props {
  type: SearchType;
  searchObject: SearchParams;
  search: (o: SearchParams) => void;
  subjects: Node[];
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
