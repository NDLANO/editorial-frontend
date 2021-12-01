/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { searchClasses } from '../../SearchContainer';
import { SearchParams } from '../form/SearchForm';

const pageSizeOptions = [4, 6, 8, 10, 12, 14, 16, 18, 20];

interface Props {
  searchObject?: SearchParams;
  search: (params: SearchParams, type: string) => void;
  totalCount?: number;
  type: string;
}

const SearchListOptions = ({
  searchObject = { 'page-size': 10 },
  search,
  type,
  totalCount,
}: Props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(searchObject['page-size'] ?? 10);

  const handlePageSizeChange = (evt: FormEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(evt.currentTarget.value));
    search({ 'page-size': parseInt(evt.currentTarget.value), page: 1 }, type);
  };

  return (
    <div {...searchClasses('options-container')}>
      <div {...searchClasses('option')}>
        <span data-cy="totalCount">
          {t('searchPage.totalCount')}: <b>{totalCount}</b>
        </span>
        <select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizeOptions.map(size => (
            <option key={`pageSize_${size}`} value={size}>
              {t('searchPage.pageSize', { pageSize: size })}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchListOptions;
