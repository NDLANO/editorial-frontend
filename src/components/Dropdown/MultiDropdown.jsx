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
import { DropDown } from './';

class MultiDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '', selectedItems: [], isOpen: false };
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
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onWrapperClick = this.onWrapperClick.bind(this);
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

    /* switch (event.keyCode) {
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
  onInputBlur(e) {
    if (this.state.isOpen) {
      this.handleToggleMenu();
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

  handleChange(selectedItem) {
    // const { onChange } = this.props;

    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem);
    } else {
      this.addSelectedItem(selectedItem);
    }
    // onChange({ target: { name, value: selectedItem } });
  }

  addSelectedItem(selectedItem) {
    this.setState({
      selectedItems: [...this.state.selectedItems, selectedItem],
    });
  }

  removeItem(selectedItem) {
    const copy = [...this.state.selectedItems];
    copy.splice(copy.findIndex(element => element.id === selectedItem.id), 1);
    copy.filter(val => val);
    this.setState({ selectedItems: copy });
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
    const { selectedItems, isOpen, inputValue } = this.state;

    const inputProps = {
      value: inputValue,
      ref: this.inputRef,
      onChange: this.onInputChange,
      onKeyDown: this.onInputKeyDown,
      onFocus: this.onInputFocus,
      onBlur: this.onInputBlur,
    };

    return (
      <DropDown
        multiSelect
        isOpen={isOpen}
        onChange={this.handleChange}
        selectedItem={selectedItems}
        onRemoveItem={this.removeItem}
        onStateChange={this.handleStateChange}
        inputWrapperRef={this.inputWrapperRef}
        onWrapperClick={this.onWrapperClick}
        inputProps={inputProps}
        onToggleMenu={this.handleToggleMenu}
        {...this.props}
      />
    );
  }
}

MultiDropdown.propTypes = {
  onChange: PropTypes.func, // TODO: change to required
};

export default MultiDropdown;
