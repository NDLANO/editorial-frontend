/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import {
  DropdownMenu,
  DropdownInput,
  DropdownSearchAction,
  dropDownClasses,
} from '../common';
import { itemToString } from '../../../util/downShiftHelpers';

class AsyncDropDown extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      isOpen: false,
      inputValue: '',
      selectedItem: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
  }

  async componentWillMount() {
    const { apiAction } = this.props;
    const items = await apiAction('');
    this.setState({ items });
  }

  async handleInputChange(evt) {
    const value = evt.target.value;
    this.handleSearch(value);
  }

  handleSearch(query = '') {
    const { apiAction } = this.props;

    this.setState({ inputValue: query, isOpen: true });
    debounce(async () => {
      const items = await apiAction(query);
      this.setState({ items });
    }, 500)();
  }

  handleChange(selectedItem) {
    const { onChange, textField } = this.props;
    if (!selectedItem) {
      onChange(undefined);
      this.setState({ inputValue: '', selectedItem: null });
    } else {
      this.handleToggleMenu();
      this.setState({
        selectedItem,
        inputValue: itemToString(selectedItem, textField),
      });
      onChange(selectedItem);
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
      placeholder,
      textField,
      valueField,
      messages,
      onClick,
      ...rest
    } = this.props;

    const { items } = this.state;
    const inputProps = {
      placeholder,
      onChange: this.handleInputChange,
      onClick,
      value: this.state.inputValue,
    };

    return (
      <Downshift
        {...rest}
        itemToString={item => itemToString(item, textField)}
        onStateChange={this.handleStateChange}
        onChange={this.handleChange}
        isOpen={this.state.isOpen}
        selectedItem={this.state.selectedItem}
        render={downshiftProps => (
          <div {...dropDownClasses()}>
            <DropdownInput {...downshiftProps} inputProps={inputProps} />
            <DropdownMenu
              {...downshiftProps}
              items={items}
              messages={messages}
              textField={textField}
              valueField={valueField}
              asyncSelect
            />
            <DropdownSearchAction
              {...downshiftProps}
              onToggleMenu={this.handleToggleMenu}
            />
          </div>
        )}
      />
    );
  }
}

AsyncDropDown.propTypes = {
  onChange: PropTypes.func.isRequired,
  apiAction: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onClick: PropTypes.func,
  messages: PropTypes.shape({
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
};

AsyncDropDown.defaultPropTypes = {
  placeholder: '',
};

export default AsyncDropDown;
