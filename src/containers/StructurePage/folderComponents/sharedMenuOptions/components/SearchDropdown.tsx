/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Downshift, { GetItemPropsOptions } from 'downshift';
import { useState } from 'react';

import styled from '@emotion/styled';
//@ts-ignore
import { Input, DropdownMenu } from '@ndla/forms';
import { Spinner } from '@ndla/icons';
import { Search } from '@ndla/icons/common';
import { Node } from '@ndla/types-taxonomy';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { SearchResultBase } from '../../../../../interfaces';
import useDebounce from '../../../../../util/useDebounce';

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSpinner = styled(Spinner)`
  margin: 0px;
`;

interface DropdownItem<Type> {
  id: string | number;
  name: string;
  image?: string;
  description?: string;
  originalItem: Type;
  disabled?: boolean;
}

interface BaseParams {
  query?: string;
  page?: number;
}

interface Props<ParamType extends BaseParams, InnerType, ApiType, Type = ApiType> {
  onChange: (value: InnerType) => void;
  useQuery: (
    params: ParamType,
    options?: Partial<UseQueryOptions<ApiType, unknown, Type>>,
  ) => UseQueryResult<Type, unknown>;
  params?: ParamType;
  options?: Partial<UseQueryOptions<ApiType, unknown, Type>>;
  transform: (value: Type) => SearchResultBase<DropdownItem<InnerType>>;
  placeholder: string;
  preload?: boolean;
  selectedItems?: Node[];
  id?: string;
  wide?: boolean;
  positionAbsolute?: boolean;
  isMultiSelect?: boolean;
  maxRender?: number;
}

const SearchDropdown = <ParamType extends BaseParams, InnerType, ApiType, Type>({
  onChange,
  useQuery,
  params,
  options = {},
  transform,
  placeholder,
  preload = true,
  selectedItems,
  id,
  wide = true,
  positionAbsolute = true,
  isMultiSelect = false,
  maxRender = 10,
}: Props<ParamType, InnerType, ApiType, Type>) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const debouncedQuery = useDebounce(query);
  const allParams: ParamType = {
    query: debouncedQuery,
    page,
    ...params,
  } as ParamType;

  const searchQuery = useQuery(allParams, {
    ...options,
    enabled: options.enabled ? options.enabled : debouncedQuery.length > 1,
  });
  useQuery(
    { page: page + 1, ...allParams },
    {
      ...options,
      enabled: options.enabled
        ? options.enabled
        : debouncedQuery.length > 1 || (!!preload && debouncedQuery.length > 1),
    },
  );
  const transformed = searchQuery.data ? transform(searchQuery.data) : undefined;
  const handleOnChange = (item: DropdownItem<InnerType> | undefined) => {
    if (item) {
      onChange(item.originalItem);
    }
    setQuery('');
  };

  return (
    <Downshift
      onInputValueChange={(query) => setQuery(query ?? '')}
      inputValue={query}
      itemToString={(e: DropdownItem<Type>) => e?.name}
      onChange={handleOnChange}
    >
      {({ getInputProps, getRootProps, getItemProps, ...downShiftProps }) => {
        return (
          <DropdownWrapper {...getRootProps()}>
            <Input
              {...getInputProps({ placeholder })}
              white
              id={id}
              iconRight={
                searchQuery.isInitialLoading ? <StyledSpinner size="normal" /> : <Search />
              }
            />
            <DropdownMenu
              items={transformed?.results ?? []}
              idField="id"
              labelField="name"
              getItemProps={({ item, ...props }: GetItemPropsOptions<DropdownItem<Type>>) =>
                getItemProps({ ...props, item, disabled: !!item.disabled })
              }
              {...downShiftProps}
              positionAbsolute={positionAbsolute}
              totalCount={transformed?.totalCount ?? 0}
              page={page}
              handlePageChange={(page: { page: number }) => setPage(page.page)}
              wide={wide}
              selectedItems={selectedItems}
              multiSelect={isMultiSelect}
              maxRender={maxRender}
            />
          </DropdownWrapper>
        );
      }}
    </Downshift>
  );
};

export default SearchDropdown;
