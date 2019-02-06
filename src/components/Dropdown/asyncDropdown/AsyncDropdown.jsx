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

  async UNSAFE_componentWillMount() {
    this.isMountedOrMounting = true;
    const { apiAction } = this.props;
    const items = await apiAction('');
    if (this.isMountedOrMounting) {
      this.setState({ items });
    }
  }

  componentDidMount() {
    this.isMountedOrMounting = true;
  }

  componentWillUnmount() {
    this.isMountedOrMounting = false;
  }

  async handleInputChange(evt) {
    const { value } = evt.target;
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
        inputValue: textField
          ? itemToString(selectedItem, textField)
          : selectedItem.title,
      });
      onChange(selectedItem);
    }
  }

  handleToggleMenu() {
    if (!this.props.alwaysOpen)
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
      alwaysOpen,
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
        isOpen={this.state.isOpen || alwaysOpen}
        selectedItem={this.state.selectedItem}>
        {downshiftProps => {
          const DropdownSearch = (
            <DropdownSearchAction
              {...downshiftProps}
              onToggleMenu={this.handleToggleMenu}
            />
          );
          const { multiselect } = downshiftProps;
          return (
            <div {...dropDownClasses()}>
              <DropdownInput
                {...downshiftProps}
                inputProps={inputProps}
                multiselect={multiselect}
                iconRight={multiselect ? null : DropdownSearch}
                onToggleMenu={this.handleToggleMenu}
              />
              <DropdownMenu
                {...downshiftProps}
                multiselect={multiselect}
                items={items}
                messages={messages}
                textField={textField}
                valueField={valueField}
                asyncSelect
                resourceMenu
              />
              {multiselect && DropdownSearch}
            </div>
          );
        }}
      </Downshift>
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
  alwaysOpen: PropTypes.bool,
};

AsyncDropDown.defaultPropTypes = {
  placeholder: '',
};

export default AsyncDropDown;
