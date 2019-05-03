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
import { DropdownMenu, Input } from '@ndla/forms';
import { Search } from '@ndla/icons/common';
import { Spinner } from '@ndla/editor';
import { injectT } from '@ndla/i18n';
import {
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

  async componentDidMount() {
    this.isMountedOrMounting = true;
    if (this.isMountedOrMounting) {
      this.handleSearch();
    }
  }

  componentWillUnmount() {
    this.isMountedOrMounting = false;
  }

  async handleInputChange(evt) {
    const { value } = evt.target;
    const { currentDebounce } = this.state;

    if (currentDebounce) {
      currentDebounce.cancel();
    }
    const debounced = debounce(() => this.handleSearch(value), 400);
    debounced();
    this.setState({
      inputValue: value,
      isOpen: true,
      currentDebounce: debounced,
    });
  }

  async handleSearch(query = '') {
    const { apiAction } = this.props;
    this.setState({ loading: true });
    const items = await apiAction(query);
    this.setState({ items, loading: false });
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
      t,
      testid,
      ...rest
    } = this.props;

    const { items, loading } = this.state;
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
        selectedItem={this.state.selectedItem}>
        {({ getInputProps, ...downshiftProps }) => {
          return (
            <div>
              <Input
                {...getInputProps(inputProps)}
                data-testid={testid}
                iconRight={
                  loading ? <Spinner size="normal" margin="0" /> : <Search />
                }
              />
              <DropdownMenu
                {...downshiftProps}
                items={items}
                textField={textField}
                valueField={valueField}
                asyncSelect
                resourceMenu
              />
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

export default injectT(AsyncDropDown);
