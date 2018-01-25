/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {
  DropdownMenu,
  DropdownInput,
  DropdownAction,
  dropDownClasses,
  RESOURCE_FILTER_CORE,
} from '../common';
import { itemToString } from '../../../util/downShiftHelpers';

class MultiDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedItems: props.selectedItems || [],
      isOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.inputWrapperRef = this.inputWrapperRef.bind(this);
    this.inputRef = this.inputRef.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.handlePopupClick = this.handlePopupClick.bind(this);
  }

  onWrapperClick(e) {
    if (this.inputWrapper === e.target || this.input === e.target) {
      this.focusOnInput();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  onInputFocus() {
    if (!this.state.isOpen) {
      this.handleToggleMenu();
    }
  }

  handlePopupClick(selectedItem) {
    const { selectedItems } = this.state;

    const copy = [...selectedItems];

    // Unset current primary item
    if ('primary' in selectedItem) {
      const nonPrimary = copy.find(element => element.primary === true);
      copy.splice(copy.findIndex(element => element.primary === true), 1, {
        ...nonPrimary,
        primary: false,
      });
    }

    copy.splice(
      copy.findIndex(element => element.id === selectedItem.id),
      1,
      selectedItem,
    );
    copy.filter(val => val);

    this.setState({ selectedItems: copy });
    this.props.onChange(copy);
  }

  focusOnInput() {
    this.input.focus();
    if (typeof this.input.getInput === 'function') {
      this.input.getInput().focus();
      this.setState({ isOpen: true });
    }
  }

  inputRef(c) {
    this.input = c;
  }

  inputWrapperRef(c) {
    this.inputWrapper = c;
  }

  handleChange(selectedItem, stateAndHelpers) {
    const { selectedItems } = this.state;
    const { id } = stateAndHelpers;

    if (selectedItems.length === 0) {
      // Add if empty state first
      this.addSelectedItem(selectedItem, id);
    } else if (
      selectedItems.filter(item => item.id === selectedItem.id).length > 0
    ) {
      this.removeItem(selectedItem);
    } else {
      this.addSelectedItem(selectedItem, id);
    }
  }

  addSelectedItem(selectedItem, id) {
    const { selectedItems } = this.state;
    let newItem;

    // Additional tag attributes by type
    if (id === 'topics') {
      if (this.state.selectedItems.length === 0) {
        newItem = { ...selectedItem, primary: true };
      } else {
        newItem = { ...selectedItem, primary: selectedItem.primary || false };
      }
    }
    if (id === 'filter') {
      newItem = {
        ...selectedItem,
        relevanceId: selectedItem.relevanceId || RESOURCE_FILTER_CORE.id,
      };
    }
    this.setState({
      selectedItems: [...selectedItems, newItem || selectedItem],
    });
    this.props.onChange([...selectedItems, newItem || selectedItem]);
  }

  removeItem(selectedItem) {
    const { selectedItems } = this.state;

    const item = selectedItems.find(element => element.id === selectedItem.id);
    const copy = [...selectedItems];
    copy.splice(copy.findIndex(element => element.id === item.id), 1);
    copy.filter(val => val);

    // Set first item in list as primary if a primary tag is removed
    if ('primary' in item && item.primary && copy.length > 0) {
      let newPrimaryItem = copy.shift();
      newPrimaryItem = { ...newPrimaryItem, primary: true };
      copy.unshift(newPrimaryItem);
    }
    this.setState({ selectedItems: copy });
    this.props.onChange(copy);
  }

  handleToggleMenu() {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  handleStateChange(changes) {
    const { isOpen, type } = changes;

    if (type === Downshift.stateChangeTypes.mouseUp) {
      this.setState({ isOpen });
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      this.setState({ inputValue: '' });
    }
  }

  render() {
    const {
      placeholder,
      textField,
      valueField,
      messages,
      name,
      items,
      tagProperties,
      ...rest
    } = this.props;

    const { selectedItems, isOpen, inputValue } = this.state;

    const inputProps = {
      value: inputValue,
      ref: this.inputRef,
      onChange: this.onInputChange,
      onKeyDown: this.onInputKeyDown,
      onFocus: this.onInputFocus,
      placeholder,
    };

    const tagProps = {
      tagProperties,
      handlePopupClick: this.handlePopupClick,
    };

    return (
      <Downshift
        {...rest}
        itemToString={item => itemToString(item, textField)}
        selectedItem={selectedItems}
        onStateChange={this.handleStateChange}
        onChange={this.handleChange}
        isOpen={isOpen}
        render={downshiftProps => (
          <div {...dropDownClasses()}>
            <DropdownInput
              name={name}
              multiSelect
              messages={messages}
              tagProps={tagProps}
              onRemoveItem={this.removeItem}
              onWrapperClick={this.onWrapperClick}
              inputWrapperRef={this.inputWrapperRef}
              inputProps={inputProps}
              {...downshiftProps}
            />
            <DropdownMenu
              items={items}
              {...downshiftProps}
              messages={messages}
              textField={textField}
              valueField={valueField}
              multiSelect
            />
            <DropdownAction
              multiSelect
              onToggleMenu={this.handleToggleMenu}
              {...downshiftProps}
            />
          </div>
        )}
      />
    );
  }
}

MultiDropdown.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
  messages: PropTypes.shape({
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  tagProperties: PropTypes.arrayOf(PropTypes.shape({})), // TODO: Add tag property shape(s)
};

export default MultiDropdown;
