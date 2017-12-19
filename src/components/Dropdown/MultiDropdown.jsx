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
    this.state = { selectedItems: [], isOpen: false };
    this.handleChange = this.handleChange.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleChange(selectedItem) {
    // const { onChange } = this.props;

    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem);
    } else {
      this.addSelectedItem(selectedItem);
    }

    // console.log(selectedItem);
    // onChange({ target: { name, value: selectedItem } });
  }

  addSelectedItem(item) {
    this.setState(({ selectedItems }) => ({
      selectedItems: [...selectedItems, item],
    }));
  }

  removeItem(item) {
    this.setState(({ selectedItems }) => ({
      selectedItems: selectedItems.filter(i => i !== item),
    }));
  }

  handleToggleMenu() {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  handleStateChange(changes) {
    const { isOpen, type } = changes;
    if (type === Downshift.stateChangeTypes.mouseUp) {
      this.setState({ isOpen });
    }
  }

  render() {
    const { selectedItems, isOpen } = this.state;

    return (
      <DropDown
        multiSelect
        isOpen={isOpen}
        onChange={this.handleChange}
        selectedItem={selectedItems}
        onRemoveItem={this.removeItem}
        onStateChange={this.handleStateChange}
        onToggleMenu={this.handleToggleMenu}
        {...this.props}
      />
    );
  }
}

MultiDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default MultiDropdown;
