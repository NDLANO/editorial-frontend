/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Downshift, { StateChangeOptions } from 'downshift';
import debounce from 'lodash/debounce';
// @ts-ignore
import { DropdownMenu, Input } from '@ndla/forms';
import { Search } from '@ndla/icons/common';
// @ts-ignore
import { Spinner } from '@ndla/editor';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { itemToString } from '../../../util/downShiftHelpers';
interface Props<SearchResultType, T> {
  onChange: (value: SearchResultType | undefined) => Promise<void>;
  apiAction: (query: string) => SearchResultBase<SearchResultType>;
  placeholder?: string;
  labelField?: string;
  idField?: string;
  onClick: (event: Event) => void;
  testid?: string;
  positionAbsolute?: boolean;
  startOpen?: boolean;
  multiSelect?: boolean;
  selectedItems?: T[];
  disableSelected?: boolean;
  onCreate?: (inputValue: string | EventTarget) => void;
  onKeyDown?: (event: Event) => void;
  children?: (value: { selectedItems?: T[]; removeItem: (id: number) => void }) => JSX.Element;
  removeItem: (id: number) => void;
  clearInputField: boolean;
  customCreateButtonText?: string;
  hideTotalSearchCount?: boolean;
  page?: number;
  saveOnEnter?: boolean;
  showPagination?: boolean;
}
interface SearchResultBase<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  language: string;
  results: T[];
}
interface SearchParams {
  query?: string;
  page?: number;
  'page-size'?: number;
  language?: string;
}
export const AsyncDropdown = <SearchResultType extends { [key: string]: any }, T extends { [key: string]: any }>({
  children,
  placeholder = '',
  labelField,
  idField,
  onClick,
  t,
  testid,
  positionAbsolute,
  startOpen,
  multiSelect,
  selectedItems = [],
  disableSelected,
  onCreate,
  onKeyDown,
  removeItem,
  clearInputField,
  customCreateButtonText,
  hideTotalSearchCount,
  showPagination,
  saveOnEnter,
  apiAction,
  onChange,
  ...rest
}: Props<SearchResultType, T> & tType) => {
  const [items, setItems] = useState<
    (SearchResultBase<T> & { title: string; description: string; image: string; alt: string })[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<EventTarget | string>('');
  const [currentDebounce, setCurrentDebounce] = useState<{ cancel: Function } | undefined>();
  const [keepOpen, setKeepOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(1);
  const handleSearch = useCallback(
    async (query = '', page: number) => {
      setLoading(true);
      const apiOutput = await apiAction(showPagination ? { query: query, page: page } : query);
      const items = (Array.isArray(apiOutput) ? apiOutput : apiOutput?.results) || [];
      setTotalCount(apiOutput?.totalCount || null);
      setItems(
        items
          ? items.map(item => ({
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
  useEffect(() => {
    handleSearch('', page);
  }, [handleSearch, page]);
  const handlePageChange = (page: { page: number }) => {
    handleSearch(inputValue, page.page);
    setPage(page.page);
  };
  const handleChange = (selectedItem: SearchResultType) => {
    if (!selectedItem) {
      onChange(undefined);
      setSelectedItem(null);
      setInputValue('');
    } else {
      setSelectedItem(selectedItem);
      setInputValue(labelField ? itemToString(selectedItem, labelField) : selectedItem.title);
      onChange(selectedItem);
    }
    if (children || clearInputField) {
      setInputValue('');
    }
  };
  const handleStateChange = (changes: StateChangeOptions<T>) => {
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
      {...rest}
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
export default injectT(AsyncDropdown) as <SearchResultType, T extends { [key: string]: any }>(
  props: Props<SearchResultType, T>,
) => any;
