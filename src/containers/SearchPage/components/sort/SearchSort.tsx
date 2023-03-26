/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const customSortOptions: Record<string, string[]> = {
  content: ['revisionDate'],
};

const StyledSortContainer = styled.div`
  width: 100%;
  margin-top: ${spacing.small};
  padding: ${spacing.small};
  background-color: #eaeaea;
  border: 1px solid #ddd;
`;

const StyledLabel = styled.span`
  color: black;
  text-transform: uppercase;
  margin-left: ${spacing.small};
  margin-right: ${spacing.small};
`;

const StyledSelect = styled.select`
  margin-left: 0.5em;
`;

interface Props {
  sort?: string;
  order?: string;
  onSortOrderChange: (sort: string) => void;
  type: string;
}

const SearchSort = ({
  sort: sortProp = 'relevance',
  order: orderProp = 'desc',
  onSortOrderChange,
  type,
}: Props) => {
  const [sort, setSort] = useState(sortProp);
  const [order, setOrder] = useState(orderProp);
  const location = useLocation();
  const { t } = useTranslation();
  const sortOptions = [
    'id',
    'relevance',
    'title',
    'lastUpdated',
    ...(customSortOptions[type] ?? []),
  ];

  useEffect(() => {
    const { sort: sortOrder } = queryString.parse(location.search);
    const splitSortOrder = sortOrder ? sortOrder.split('-') : '-';
    const sort = splitSortOrder.length > 1 ? splitSortOrder[1] : splitSortOrder[0];
    const order = splitSortOrder.length > 1 ? 'desc' : 'asc';
    setSort(sort);
    setOrder(order);
  }, [location]);

  const handleSortChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const _order = order === 'desc' ? '-' : '';
    const sort = evt.target.value;
    setSort(sort);
    onSortOrderChange(`${_order + sort}`);
  };

  const handleOrderChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const newOrder = evt.target.value === 'desc' ? '-' : '';
    setOrder(evt.target.value);
    onSortOrderChange(`${newOrder + sort}`);
  };

  const orderOptions = ['desc', 'asc'];

  return (
    <StyledSortContainer>
      <StyledLabel>{t('searchForm.sorting')}</StyledLabel>
      <StyledSelect onChange={handleSortChange} value={sort}>
        {sortOptions.map(option => (
          <option key={`sortoptions_${option}`} value={option}>
            {t(`searchForm.sort.${option}`)}
          </option>
        ))}
      </StyledSelect>
      <StyledLabel>{t('searchForm.order')}</StyledLabel>
      <StyledSelect onChange={handleOrderChange} value={order}>
        {orderOptions.map(option => (
          <option key={`orderoptions_${option}`} value={option}>
            {t(`searchForm.${option}`)}
          </option>
        ))}
      </StyledSelect>
    </StyledSortContainer>
  );
};

export default SearchSort;
