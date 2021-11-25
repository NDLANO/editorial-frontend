/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import MastheadSearchForm from './components/MastheadSearchForm';
import { toSearch } from '../../util/routeHelpers';
import { SearchTypeValues } from '../../constants';
import { parseSearchParams } from '../SearchPage/components/form/SearchForm';
import { SearchType } from '../../interfaces';

interface Props {
  close: () => void;
}

const MastheadSearch = ({ close }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = queryString.parse(location.search).query;

  const onSearchQuerySubmit = (searchQuery: string) => {
    const type =
      location.pathname
        .split('/')
        .find(pathValue => SearchTypeValues.includes(pathValue as SearchType)) || 'content';

    let oldParams;
    if (type === 'content') {
      oldParams = parseSearchParams(location.search);
    } else {
      oldParams = queryString.parse(location.search);
    }

    const newParams = {
      ...oldParams,
      query: searchQuery || undefined,
      page: 1,
      sort: '-lastUpdated',
      'page-size': 10,
    };

    navigate(toSearch(newParams, type));

    close();
  };

  return (
    <MastheadSearchForm
      query={query}
      onSearchQuerySubmit={(searchQuery: string) => onSearchQuerySubmit(searchQuery)}
    />
  );
};

export default MastheadSearch;
