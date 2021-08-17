/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React, { useCallback, useEffect, useState } from 'react';
import Downshift, { StateChangeOptions } from 'downshift';
import debounce from 'lodash/debounce';
// @ts-ignore
import { DropdownMenu, Input } from '@ndla/forms';
import { Search } from '@ndla/icons/common';
// @ts-ignore
import { Spinner } from '@ndla/editor';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { itemToString } from '../../../util/downShiftHelpers';

interface Props<SearchResult, ApiType> {
  onChange: (value: ApiType) => Promise<void> | void;
  apiAction: (query: string, page?: number) => Promise<SearchResultBase<SearchResult>>;
  placeholder?: string;
  labelField?: string;
  idField?: string;
  onClick?: (event: Event) => void;
  positionAbsolute?: boolean;
  startOpen?: boolean;
  multiSelect?: boolean;
  selectedItems?: ApiType[];
  disableSelected?: boolean;
  onCreate?: (inputValue: string) => void;
  children?: (value: {
    selectedItems: ApiType[];
    value: string;
    removeItem?: (tag: string) => void;
    onBlur?: (event: Event) => void;
    onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent) => void;
  }) => JSX.Element;
  clearInputField?: boolean;
  customCreateButtonText?: string;
  hideTotalSearchCount?: boolean;
  saveOnEnter?: boolean;
  showPagination?: boolean;
  onBlur?: (event: Event) => void;
  removeItem?: (id: string) => void;
}

export interface ExtendedSearchResultType {
  title?: { title: string; language: string } | string;
  metaDescription?: string;
  metaImage?: {
    alt: string;
    url: string;
  };
}

interface SearchResultBase<SearchResult> {
  totalCount: number;
  page?: number;
  pageSize?: number;
  language?: string;
  results: SearchResult[];
}

export const AsyncDropdown = <
  SearchResult extends ExtendedSearchResultType,
  ApiType extends { title?: { title: string; language: string } | string }
>({
  children,
  placeholder = '',
  labelField,
  idField,
  onClick,
  positionAbsolute,
  startOpen,
  multiSelect,
  selectedItems = [],
  disableSelected,
  onCreate,
  clearInputField,
  customCreateButtonText,
  hideTotalSearchCount,
  showPagination,
  saveOnEnter,
  apiAction,
  onChange,
  onBlur,
  removeItem,
}: Props<SearchResult, ApiType>) => {
  const [items, setItems] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApiType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [currentDebounce, setCurrentDebounce] = useState<{ cancel: Function }>();
  const [keepOpen, setKeepOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(1);

  useEffect(() => {
    handleSearch('', page);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    async (query: string = '', page: number) => {
      setLoading(true);
      const apiOutput = await apiAction(query, showPagination ? page : undefined);
      const items = (Array.isArray(apiOutput) ? apiOutput : apiOutput.results) || [];
      setTotalCount(apiOutput.totalCount ?? 1);
      setItems(
        items
          ? items.map((item: SearchResult) => ({
              ...item,
              title: convertFieldWithFallback(item, 'title', ''),
              description: convertFieldWithFallback(item, 'metaDescription', ''),
              image: item.metaImage && `${item.metaImage.url}?width=60`,
              alt: item.metaImage && item.metaImage.alt,
            }))
          : [],
      );
      setLoading(false);
      setKeepOpen(keepOpen || !!query);
    },
    [apiAction, keepOpen, showPagination],
  );

  const handleInputChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    if (currentDebounce) {
      currentDebounce.cancel();
    }
    const debounced = debounce(() => handleSearch(value, page), 400);
    setCurrentDebounce({ ...debounced });
    debounced();
    setInputValue(value);
    setPage(1);
  };

  const handlePageChange = (page: { page: number }) => {
    handleSearch(inputValue, page.page);
    setPage(page.page);
  };

  const handleChange = (selectedItem: ApiType) => {
    setSelectedItem(selectedItem);
    setInputValue(labelField ? itemToString(selectedItem, labelField) : selectedItem.title);
    onChange(selectedItem);

    if (children || clearInputField) {
      setInputValue('');
    }
  };

  const handleStateChange = (changes: StateChangeOptions<ApiType>) => {
    const { type } = changes;
    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setInputValue('');
    }
  };

  const inputProps = {
    placeholder,
    onChange: handleInputChange,
    onClick,
    value: inputValue,
    onBlur,
  };

  const getOnKeydown = (createOnEnter?: boolean) => {
    return (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        createOnEnter && handleCreate();
      }
      if (event.key === 'ArrowDown') {
        setKeepOpen(true);
      }
    };
  };
  const handleCreate = () => {
    if (onCreate) {
      onCreate(inputValue);
    }
    if (children || clearInputField) {
      setInputValue('');
    }
  };

  return (
    <Downshift
      itemToString={item => itemToString(item, labelField)}
      onStateChange={handleStateChange}
      onChange={handleChange}
      initialIsOpen={startOpen}
      selectedItem={selectedItem}
      defaultIsOpen={keepOpen}
      onOuterClick={() => {
        setKeepOpen(false);
      }}>
      {({ getInputProps, openMenu, ...downshiftProps }) => {
        const inpProps = getInputProps({
          ...inputProps,
          onKeyDown: getOnKeydown(saveOnEnter && downshiftProps.highlightedIndex === null),
        });

        return (
          <div style={positionAbsolute ? { position: 'relative' } : undefined}>
            {children ? (
              children({ selectedItems, removeItem, ...inpProps })
            ) : (
              <Input
                {...inpProps}
                data-testid={'dropdownInput'}
                iconRight={loading ? <Spinner size="normal" margin="0" /> : <Search />}
              />
            )}
            <DropdownMenu
              idField={idField}
              labelField={labelField}
              multiSelect={multiSelect}
              selectedItems={selectedItems}
              disableSelected={disableSelected}
              {...downshiftProps}
              items={items}
              totalCount={totalCount}
              positionAbsolute={positionAbsolute}
              onCreate={onCreate && handleCreate}
              customCreateButtonText={customCreateButtonText}
              hideTotalSearchCount={hideTotalSearchCount}
              page={showPagination && page}
              handlePageChange={handlePageChange}
            />
          </div>
        );
      }}
    </Downshift>
  );
};
export default AsyncDropdown;
