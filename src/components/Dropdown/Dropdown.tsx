/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import Downshift, { StateChangeOptions } from 'downshift';
//@ts-ignore
import { DropdownInput, DropdownMenu } from '@ndla/forms';
import { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';

const DropdownContainer = styled.div`
  position: relative;
`;

export interface DropdownItem {
  name: string;
  id: string;
}

interface Props {
  onSelect: (value: DropdownItem) => void;
  onReset: () => void;
  selectedTag?: DropdownItem;
  items: DropdownItem[];
  placeholder: string;
}

const Dropdown = ({ onSelect, selectedTag, onReset, items, placeholder }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [input, setInput] = useState('');

  const filteredItems = items
    .filter(item => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    })
    .sort();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setInput(value);
  };

  const onStateChange = (changes: StateChangeOptions<string>) => {
    const { isOpen, type } = changes;

    if (
      type === Downshift.stateChangeTypes.keyDownArrowUp ||
      type === Downshift.stateChangeTypes.keyDownArrowDown
    ) {
      setDropdownOpen(true);
    }
    if (type === Downshift.stateChangeTypes.mouseUp) {
      setDropdownOpen(!!isOpen);
      if (!isOpen) {
        setInput('');
      }
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setInput('');
    }
  };

  const onSelectItem = (selectedItem: DropdownItem) => {
    onSelect(selectedItem);
    setDropdownOpen(false);
  };

  const onFocus = () => {
    setDropdownOpen(true);
  };

  return (
    <Downshift
      isOpen={dropdownOpen}
      onSelect={onSelectItem}
      onStateChange={onStateChange}
      itemToString={item => {
        return item?.name;
      }}>
      {({ getInputProps, getMenuProps, getItemProps, getRootProps }): JSX.Element => {
        return (
          <DropdownContainer {...getRootProps()}>
            <DropdownInput
              idField={'id'}
              labelField={'name'}
              multiSelect
              {...getInputProps({
                value: input,
                onChange: onChangeInput,
                onFocus: onFocus,
                onClick: onFocus,
              })}
              placeholder={placeholder}
              values={selectedTag ? [selectedTag] : []}
              removeItem={onReset}
            />
            <DropdownMenu
              idField={'id'}
              labelField={'name'}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              isOpen={dropdownOpen}
              items={filteredItems}
              maxRender={1000}
              hideTotalSearchCount
              positionAbsolute
            />
          </DropdownContainer>
        );
      }}
    </Downshift>
  );
};

export default Dropdown;
