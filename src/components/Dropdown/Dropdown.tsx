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

interface Props {
  onSelect: (value: string) => void;
  onReset: () => void;
  selectedTag?: string;
  items: string[];
}

const Dropdown = ({ onSelect, selectedTag, onReset, items }: Props) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setSearchInput(value);
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
        setSearchInput('');
      }
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setSearchInput('');
    }
  };

  const onSelectTag = (selectedItem: string) => {
    onSelect(selectedItem);
    setDropdownOpen(false);
  };

  const onRemoveTag = () => {
    onReset();
  };

  const onFocus = () => {
    setDropdownOpen(true);
  };

  return (
    <Downshift isOpen={dropdownOpen} onSelect={onSelectTag} onStateChange={onStateChange}>
      {({ getInputProps, getMenuProps, getItemProps }): JSX.Element => {
        return (
          <div>
            <DropdownInput
              multiSelect
              {...getInputProps({
                value: searchInput,
                onChange: onChangeSearchInput,
                onFocus: onFocus,
                onClick: onFocus,
              })}
              placeholder={t('form.categories.label')}
              values={selectedTag ? [selectedTag] : []}
              removeItem={onRemoveTag}
            />
            <DropdownMenu
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              isOpen={dropdownOpen}
              items={items}
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
