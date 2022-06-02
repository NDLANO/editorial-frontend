/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { SearchParams } from '../form/SearchForm';

const pageSizeOptions = [4, 6, 8, 10, 12, 14, 16, 18, 20];

interface Props {
  searchObject?: SearchParams;
  search: (params: SearchParams, type: string) => void;
  totalCount?: number;
  type: string;
}

const StyledOptionContainer = styled.div`
  color: black;
  margin: ${spacing.normal} 0;
`;

const StyledOptionSpan = styled.span`
  display: block;
  margin-bottom: 2px;
  text-transform: uppercase;
`;

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
    <StyledOptionContainer>
      <div>
        <StyledOptionSpan data-cy="totalCount">
          {t('searchPage.totalCount')}: <b>{totalCount}</b>
        </StyledOptionSpan>
        <select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizeOptions.map(size => (
            <option key={`pageSize_${size}`} value={size}>
              {t('searchPage.pageSize', { pageSize: size })}
            </option>
          ))}
        </select>
      </div>
    </StyledOptionContainer>
  );
};

export default SearchListOptions;
