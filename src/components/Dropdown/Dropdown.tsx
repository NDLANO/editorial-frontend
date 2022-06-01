/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import Downshift, { StateChangeOptions } from 'downshift';
import { DropdownInput, DropdownMenu } from '@ndla/forms';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DropdownItem {
  name: string;
  id: string;
}
interface Props {
  onSelect: (value: DropdownItem) => void;
  onReset: () => void;
  selectedTag?: string;
  items: DropdownItem[];
}

const Dropdown = ({ onSelect, selectedTag, onReset, items }: Props) => {
  const { t } = useTranslation();
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
    console.log(selectedItem);
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
      itemToString={item => item.name}>
      {({ getInputProps, getMenuProps, getItemProps }): JSX.Element => {
        return (
          <div>
            <DropdownInput
              idfield
              multiSelect
              {...getInputProps({
                value: input,
                onChange: onChangeInput,
                onFocus: onFocus,
                onClick: onFocus,
              })}
              placeholder={t('form.categories.label')}
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
            />
          </div>
        );
      }}
    </Downshift>
  );
};

export default Dropdown;
