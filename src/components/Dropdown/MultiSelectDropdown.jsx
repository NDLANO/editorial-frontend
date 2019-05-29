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
import { DropdownInput, DropdownMenu } from '@ndla/forms';
import { itemToString } from '../../util/downShiftHelpers';

export class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isOpen: false,
    };
    this.addNewTag = this.addNewTag.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  onValueChange(newValue) {
    const { onChange, value, textField, valueField } = this.props;
    onChange({
      target: {
        name: valueField,
        value: [...value, itemToString(newValue, textField)],
      },
    });
    this.setState({ inputValue: '', isOpen: false });
  }

  addNewTag(e) {
    e.preventDefault();
    const { value } = this.props;
    const { inputValue } = this.state;
    if (!value.includes(inputValue)) {
      this.onValueChange({ title: inputValue });
    }
  }

  onInputChange(e) {
    const { data } = this.props;
    const {
      target: { value },
    } = e;
    if (value.length >= 2) {
      this.setState({
        isOpen: true,
        inputValue: value,
        data: data.filter(string => string.indexOf(value) !== -1),
      });
    } else if (value.length < 2) {
      this.setState({ inputValue: value, isOpen: false });
    }
  }

  removeItem(id) {
    const { onChange, value } = this.props;
    onChange({
      target: {
        name: 'tags',
        value: value.filter(val => val !== id),
      },
    });
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
    const { value, placeholder, textField, ...rest } = this.props;
    const { data, isOpen, inputValue = '' } = this.state;
    return (
      <Downshift
        {...rest}
        onChange={this.onValueChange}
        isOpen={isOpen}
        inputValue={`${inputValue}`}
        onStateChange={this.handleStateChange}
        itemToString={item => itemToString(item, textField)}>
        {({ getInputProps, getMenuProps, getItemProps }) => (
          <div style={{ position: 'relative' }}>
            <DropdownInput
              multiSelect
              {...getInputProps({
                onChange: this.onInputChange,
                value: inputValue,
              })}
              values={value}
              removeItem={this.removeItem}
              testid="multiselect"
            />
            <DropdownMenu
              multiSelect
              selectedItems={value}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              isOpen={isOpen}
              items={data.map((item, id) => ({
                title: item,
                id,
              }))}
              onCreate={this.addNewTag}
              positionAbsolute
            />
          </div>
        )}
      </Downshift>
    );
  }
}

MultiSelectDropdown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  disableCreate: PropTypes.bool,
  placeholder: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
};

MultiSelectDropdown.defaultProps = {
  data: [],
  textField: 'title',
  valueField: 'tags',
};

export default MultiSelectDropdown;
