/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import Downshift, { GetInputPropsOptions, StateChangeOptions } from "downshift";
import debounce from "lodash/debounce";
import { ChangeEvent, FocusEvent, KeyboardEvent, Ref, useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
//@ts-ignore
import { DropdownMenu, InputContainer, InputV3, Label } from "@ndla/forms";
import { Search } from "@ndla/icons/common";
import { SearchResultBase } from "../../../interfaces";
import { itemToString } from "../../../util/downShiftHelpers";
import { FormControl } from "../../FormField";
import { OldSpinner } from "../../OldSpinner";

const IconWrapper = styled.div`
  padding: 0 ${spacing.small};
`;

const StyledSpinner = styled(OldSpinner)`
  margin: 0;
`;

interface InputPropsOptionsRef extends GetInputPropsOptions {
  ref?: Ref<HTMLInputElement>;
}

interface Props<ApiType> {
  onChange: (value: ApiType) => Promise<void> | void;
  apiAction: (query: string, page?: number, pageSize?: number) => Promise<SearchResultBase<ApiType>>;
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
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  }) => JSX.Element;
  clearInputField?: boolean;
  customCreateButtonText?: string;
  hideTotalSearchCount?: boolean;
  saveOnEnter?: boolean;
  showPagination?: boolean;
  onBlur?: (event: Event) => void;
  removeItem?: (id: string) => void;
  initialSearch?: boolean;
  label?: string;
  menuHeight?: number;
  maxRender?: number;
  pageSize?: number;
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
  placeholder = "",
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
  initialSearch = true,
  label,
  menuHeight,
  maxRender,
  pageSize = 10,
}: Props<ApiType>) => {
  const [items, setItems] = useState<ItemValues<ApiType>[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemValues<ApiType> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentDebounce, setCurrentDebounce] = useState<{
    cancel: Function;
  }>();
  const [keepOpen, setKeepOpen] = useState<boolean>(!!startOpen);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(1);

  useEffect(() => {
    initialSearch && handleSearch("", page);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    async (query: string = "", page: number) => {
      setLoading(true);
      const apiOutput = await apiAction(query, showPagination ? page : undefined, pageSize);
      setTotalCount(apiOutput.totalCount ?? 1);
      const transformedItems: ItemValues<ApiType>[] = apiOutput.results.map((item) => ({
        ...item,
        title: (typeof item.title === "string" ? item.title : item.title?.title) ?? "",
        description:
          (typeof item.metaDescription === "string" ? item.metaDescription : item.metaDescription?.metaDescription) ??
          "",
        image: item.metaImage && `${item.metaImage.url}?width=60`,
        alt: item.metaImage?.alt,
        originalItem: item,
      }));
      setItems(transformedItems);
      setLoading(false);

      setKeepOpen(keepOpen || !!query);
    },
    [apiAction, keepOpen, pageSize, showPagination],
  );

  const handleInputChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    setKeepOpen(true);
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

  const handleChange = (selectedItem: ItemValues<ApiType> | null) => {
    setSelectedItem(selectedItem);
    if (!selectedItem) {
      return;
    }
    setInputValue(
      labelField
        ? itemToString(selectedItem, labelField)
        : typeof selectedItem.title === "string"
          ? selectedItem.title
          : selectedItem.title?.title ?? "",
    );
    onChange(selectedItem.originalItem);

    if (children || clearInputField) {
      setInputValue("");
    }
    if (!multiSelect) {
      setKeepOpen(false);
    }
  };

  const handleStateChange = (changes: StateChangeOptions<ApiType>) => {
    const { type } = changes;
    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setInputValue("");
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
      if (event.key === "Enter") {
        event.preventDefault();
        createOnEnter && handleCreate();
      }
      if (event.key === "ArrowDown") {
        setKeepOpen(true);
      } else {
        setKeepOpen(true);
      }
    };
  };
  const handleCreate = () => {
    if (onCreate) {
      onCreate(inputValue);
    }
    if (children || clearInputField) {
      setInputValue("");
    }
  };

  return (
    <Downshift
      itemToString={(item) => itemToString(item, labelField)}
      onStateChange={handleStateChange}
      onChange={handleChange}
      isOpen={keepOpen}
      initialIsOpen={startOpen}
      selectedItem={selectedItem}
      onOuterClick={() => {
        setKeepOpen(false);
      }}
    >
      {({ getInputProps, openMenu, ...downshiftProps }) => {
        const inpProps = getInputProps({
          ...inputProps,
          onKeyDown: getOnKeydown(saveOnEnter && downshiftProps.highlightedIndex === null),
        });

        return (
          <div style={positionAbsolute ? { position: "relative" } : undefined}>
            {children ? (
              children({ selectedItems, removeItem, ...inpProps })
            ) : (
              <FormControl>
                {label && (
                  <Label textStyle="label-small" margin="none">
                    {label ?? placeholder}
                  </Label>
                )}
                <InputContainer>
                  <InputV3 {...(inpProps as InputPropsOptionsRef)} data-testid={"dropdown-input"} />
                  <IconWrapper>{loading ? <StyledSpinner size="normal" /> : <Search />}</IconWrapper>
                </InputContainer>
              </FormControl>
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
              page={showPagination ? page : undefined}
              handlePageChange={handlePageChange}
              menuHeight={menuHeight}
              maxRender={maxRender ? maxRender : pageSize}
            />
          </div>
        );
      }}
    </Downshift>
  );
};
export default AsyncDropdown;
