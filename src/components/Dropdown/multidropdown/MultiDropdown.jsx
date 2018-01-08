/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {
  DropdownMenu,
  DropdownInput,
  DropdownSearchAction,
  dropDownClasses,
} from '../common';
import { itemToString } from '../../../util/downShiftHelpers';

class MultiDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedItems: [],
      isOpen: false,
      primaryResourceType: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.inputWrapperRef = this.inputWrapperRef.bind(this);
    this.inputRef = this.inputRef.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.setPrimaryResourceType = this.setPrimaryResourceType.bind(this);
    this.handlePopupClick = this.handlePopupClick.bind(this);
  }

  onWrapperClick(e) {
    if (this.inputWrapper === e.target || this.input === e.target) {
      this.focusOnInput();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onInputKeyDown(event) {
    const { inputValue } = this.state;
    const currentValue = event.target.value;

    /*  switch (event.keyCode) {
      case 8: // backspace
        if (!currentValue) {
          event.preventDefault();
          this.popValue();
        }
        return;
      case 46: // backspace
        if (!this.state.inputValue && this.props.deleteRemoves) {
          event.preventDefault();
          this.popValue();
  }
        return;
      default: return;
    } */
    // event.preventDefault();
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  onInputFocus(e) {
    if (!this.state.isOpen) {
      this.handleToggleMenu();
    }
  }

  setPrimaryResourceType(selectedItem) {
    this.setState({ primaryResourceType: selectedItem });
  }

  handlePopupClick(selectedItem, name) {
    if (name === 'resourceTypes') {
      this.setPrimaryResourceType(selectedItem);
    }
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
    // const { onChange } = this.props;
    const { id } = stateAndHelpers;

    if (selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, id);
    } else {
      this.addSelectedItem(selectedItem, id);
    }
    // onChange({ target: { name, value: selectedItem } });
  }

  addSelectedItem(selectedItem, id) {
    const { selectedItems } = this.state;
    this.setState({
      selectedItems: [...selectedItems, selectedItem],
    });

    if (id === 'resourceTypes') {
      if (selectedItems.length === 0) {
        this.setState({ primaryResourceType: selectedItem });
      }
    }
  }

  removeItem(selectedItem, id) {
    const { selectedItems, primaryResourceType } = this.state;

    const copy = [...selectedItems];
    copy.splice(copy.findIndex(element => element.id === selectedItem.id), 1);
    copy.filter(val => val);
    this.setState({ selectedItems: copy });

    if (id === 'resourceTypes') {
      if (selectedItem === primaryResourceType) {
        this.setState({ primaryResourceType: copy.length > 0 ? copy[0] : {} });
      }
    }
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
      selectedItem,
      placeholder,
      textField,
      valueField,
      messages,
      items,
      ...rest
    } = this.props;

    const {
      selectedItems,
      isOpen,
      inputValue,
      primaryResourceType,
    } = this.state;

    const inputProps = {
      value: inputValue,
      ref: this.inputRef,
      onChange: this.onInputChange,
      onKeyDown: this.onInputKeyDown,
      onFocus: this.onInputFocus,
    };

    const tagProps = {
      primaryResourceType,
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
            <DropdownSearchAction
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
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
  messages: PropTypes.shape({
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
  items: PropTypes.shape({}),
};

export default MultiDropdown;
