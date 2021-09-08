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
import { SearchResultBase } from '../../../interfaces';

interface Props<ApiType> {
  onChange: (value: ApiType) => Promise<void> | void;
  apiAction: (query: string, page?: number) => Promise<SearchResultBase<ApiType>>;
  placeholder?: string;
  labelField?: string;
  idField?: string;
  onClick?: (event: Event) => void;
  positionAbsolute?: boolean;
  startOpen?: boolean;
  multiSelect?: boolean;
  selectedItems?: object[];
  disableSelected?: boolean;
  onCreate?: (inputValue: string) => void;
  children?: (value: {
    selectedItems: object[];
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

interface ApiTypeValues {
  title?: { title: string; language: string } | string;
  metaDescription?: { metaDescription: string; language: string } | string;
  metaImage?: {
    alt: string;
    url: string;
  };
}

interface ItemValues<ApiType> {
  title?: { title: string; language: string } | string;
  metaDescription?: { metaDescription: string; language: string } | string;
  image?: string;
  alt?: string;
  originalItem: ApiType;
}

export const AsyncDropdown = <ApiType extends ApiTypeValues>({
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
}: Props<ApiType>) => {
  const [items, setItems] = useState<ItemValues<ApiType>[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemValues<ApiType> | null>(null);
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
      // const apiItems = (Array.isArray(apiOutput) ? apiOutput : apiOutput.results) || [];
      setTotalCount(apiOutput.totalCount ?? 1);
      const transformedItems: ItemValues<ApiType>[] = apiOutput.results.map(item => ({
        ...item,
        title: convertFieldWithFallback<'title'>(item, 'title', ''),
        description: convertFieldWithFallback<'metaDescription'>(item, 'metaDescription', ''),
        image: item.metaImage && `${item.metaImage.url}?width=60`,
        alt: item.metaImage?.alt,
        originalItem: item,
      }));
      setItems(transformedItems);
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

  const handleChange = (selectedItem: ItemValues<ApiType>) => {
    setSelectedItem(selectedItem);
    setInputValue(labelField ? itemToString(selectedItem, labelField) : selectedItem.title);
    onChange(selectedItem.originalItem);

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
