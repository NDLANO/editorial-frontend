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
  state = {
    data: [],
    isOpen: false,
    inputValue: '',
  };

  onValueChange = newValue => {
    const { onChange, value, name } = this.props;
    onChange({
      target: {
        name,
        value: [...value, newValue],
      },
    });
    this.setState({ inputValue: '', isOpen: false });
    this.triggerTouched();
  };

  onCreate = evt => {
    evt.preventDefault();
    const { value } = this.props;
    const { inputValue } = this.state;
    if (!value.includes(inputValue)) {
      this.onValueChange(inputValue);
    }
  };

  onInputChange = evt => {
    const { data, labelField } = this.props;
    const {
      target: { value },
    } = evt;

    if (value.length >= 2) {
      this.setState({
        isOpen: true,
        inputValue: value,
        data: data.filter(string =>
          labelField
            ? string[labelField].indexOf(value) !== -1
            : string.indexOf(value) !== -1,
        ),
      });
    } else if (value.length < 2) {
      this.setState({ inputValue: value, isOpen: false });
    }
    this.triggerTouched();
  };

  removeItem = id => {
    const { onChange, value, name, idField } = this.props;
    onChange({
      target: {
        name,
        value: value.filter(val => (idField ? val[idField] : val) !== id),
      },
    });
    this.triggerTouched();
  };

  handleStateChange = changes => {
    const { isOpen, type } = changes;

    if (type === Downshift.stateChangeTypes.mouseUp) {
      this.setState({ isOpen });
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      this.setState({ inputValue: '' });
    }
  };

  triggerTouched = () => {
    const { name, setFieldTouched } = this.props;
    setFieldTouched && setFieldTouched(name, true, true);
  };

  render() {
    const {
      value,
      placeholder,
      labelField,
      idField,
      showCreateOption,
      ...rest
    } = this.props;
    const { data, isOpen, inputValue } = this.state;

    return (
      <Downshift
        {...rest}
        onChange={this.onValueChange}
        isOpen={isOpen}
        inputValue={inputValue}
        onStateChange={this.handleStateChange}
        itemToString={item => itemToString(item, labelField)}>
        {({ getInputProps, getMenuProps, getItemProps }) => (
          <div style={{ position: 'relative' }}>
            <DropdownInput
              multiSelect
              {...getInputProps({
                onChange: this.onInputChange,
                value: inputValue,
              })}
              idField={idField}
              labelField={labelField}
              values={value}
              removeItem={this.removeItem}
              testid="multiselect"
            />
            <DropdownMenu
              multiSelect
              idField={idField}
              labelField={labelField}
              selectedItems={value}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              isOpen={isOpen}
              items={data}
              onCreate={showCreateOption && this.onCreate}
              positionAbsolute
              disableSelected
            />
          </div>
        )}
      </Downshift>
    );
  }
}

MultiSelectDropdown.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ).isRequired,
  name: PropTypes.string.isRequired,
  disableCreate: PropTypes.bool,
  placeholder: PropTypes.string,
  labelField: PropTypes.string,
  idField: PropTypes.string,
  showCreateOption: PropTypes.bool,
  setFieldTouched: PropTypes.func,
};

MultiSelectDropdown.defaultProps = {
  data: [],
};

export default MultiSelectDropdown;
