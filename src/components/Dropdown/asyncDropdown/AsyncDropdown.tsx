/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React, { useEffect, useState, useCallback } from 'react';
import Downshift, { StateChangeOptions } from 'downshift';
import debounce from 'lodash/debounce';
// @ts-ignore
import { DropdownMenu, Input } from '@ndla/forms';
import { Search } from '@ndla/icons/common';
// @ts-ignore
import { Spinner } from '@ndla/editor';
import { injectT, tType } from '@ndla/i18n';
import { itemToString } from '../../../util/downShiftHelpers';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';
import { exec } from 'node:child_process';
interface Props<T> {
  onChange: (value: T | undefined) => Promise<void>;
  apiAction: (query: any) => Promise<SearchResultBase<T[]>>;
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
  onCreate?: any;
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
  totalCount?: number;
  page?: number;
  pageSize?: number;
  language?: string;
  results?: T[];
}
interface titleObj {
  title: string;
}
const AsyncDropDown = <T extends titleObj>({
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
}: Props<T> & tType) => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<EventTarget | string>('');
  const [currentDebounce, setCurrentDebounce] = useState<Function | undefined>(undefined);
  const [keepOpen, setKeepOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(1);

  const handleSearch = useCallback(
    async (query = '', page: number) => {
      setLoading(true);
      const apiOutput = await apiAction(showPagination ? { query: query, page: page } : query);
      const items = (Array.isArray(apiOutput) ? apiOutput : apiOutput?.results) || [];
      setTotalCount(apiOutput?.totalCount || null);
      console.log('innei search', query);
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
      console.log('heihei');
      // @ts-ignore
      currentDebounce.cancel();
    }

    console.log('debounce', currentDebounce);
    const debounced = debounce(() => handleSearch(value, page), 400);
    console.log('debounced function', debounced);
    setCurrentDebounce(debounced);
    debounced();
    setInputValue(value);
    console.log(page);
    setPage(2);
  };

  /*
     async handleInputChange(evt) {
     const { value } = evt.target;
     const { currentDebounce } = this.state;
     if (currentDebounce) {
       currentDebounce.cancel();
     }
     const debounced = debounce(() => this.handleSearch(value), 400);
     debounced();
     this.setState({
       page: 1,
       inputValue: value,
       currentDebounce: debounced,
     });
   }
   */
  useEffect(() => {
    handleSearch('', page);
  }, []);

  const handlePageChange = (page: { page: number }) => {
    handleSearch(inputValue, page.page);
    setPage(page.page);
  };
  const handleChange = (selectedItem: T) => {
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
  // ((options: StateChangeOptions<any>, stateAndHelpers: ControllerStateAndHelpers<any>) => void) | undefined
  const handleStateChange = (changes: StateChangeOptions<any>) => {
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
    onCreate(inputValue);
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
/*
 AsyncDropDown.propTypes = {
   onChange: PropTypes.func.isRequired,
   apiAction: PropTypes.func.isRequired,
   placeholder: PropTypes.string,
   labelField: PropTypes.string,
   idField: PropTypes.string,
   onClick: PropTypes.func,
   testid: PropTypes.string,
   positionAbsolute: PropTypes.bool,
   startOpen: PropTypes.bool,
   multiSelect: PropTypes.bool,
   selectedItems: PropTypes.array,
   disableSelected: PropTypes.bool,
   onCreate: PropTypes.func,
   onKeyDown: PropTypes.func,
   children: PropTypes.func,
   removeItem: PropTypes.func,
   clearInputField: PropTypes.bool,
   customCreateButtonText: PropTypes.string,
   hideTotalSearchCount: PropTypes.bool,
   page: PropTypes.number,
   saveOnEnter: PropTypes.bool,
   showPagination: PropTypes.bool,
 };
 */
export default injectT(AsyncDropDown);
