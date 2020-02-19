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
import { itemToString } from '../../../util/downShiftHelpers';
import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';

class AsyncDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      inputValue: '',
      selectedItem: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
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
      currentDebounce: debounced,
    });
  }

  async handleSearch(query = '') {
    const { apiAction } = this.props;
    this.setState({ loading: true });
    const apiOutput = await apiAction(query);
    const items =
      (Array.isArray(apiOutput) ? apiOutput : apiOutput.results) || [];
    const totalCount = apiOutput.totalCount || null;
    this.setState({
      totalCount: totalCount,
      items: items
        ? items.map(item => ({
            ...item,
            title: convertFieldWithFallback(item, 'title', ''),
            description: convertFieldWithFallback(item, 'metaDescription', ''),
            image: item.metaImage && item.metaImage.url,
            alt: item.metaImage && item.metaImage.alt,
          }))
        : [],
      loading: false,
    });
  }

  handleChange(selectedItem) {
    const { onChange, labelField } = this.props;
    if (!selectedItem) {
      onChange(undefined);
      this.setState({ inputValue: '', selectedItem: null });
    } else {
      this.setState({
        selectedItem,
        inputValue: labelField
          ? itemToString(selectedItem, labelField)
          : selectedItem.title,
      });
      onChange(selectedItem);
    }
  }

  handleStateChange(changes) {
    const { type } = changes;

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      this.setState({ inputValue: '' });
    }
  }

  render() {
    const {
      placeholder,
      labelField,
      idField,
      onClick,
      t,
      testid,
      positionAbsolute,
      startOpen,
      multiSelect,
      selectedItems,
      disableSelected,
      onCreate,
      ...rest
    } = this.props;

    const { items, loading } = this.state;
    const inputProps = {
      placeholder,
      onChange: this.handleInputChange,
      onClick,
      value: this.state.inputValue,
      onKeyDown: event => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      },
    };

    return (
      <Downshift
        {...rest}
        itemToString={item => itemToString(item, labelField)}
        onStateChange={this.handleStateChange}
        onChange={this.handleChange}
        initialIsOpen={startOpen}
        selectedItem={this.state.selectedItem}>
        {({ getInputProps, openMenu, ...downshiftProps }) => {
          return (
            <div
              style={positionAbsolute ? { position: 'relative' } : undefined}>
              <Input
                {...getInputProps({ ...inputProps })}
                data-testid={'dropdownInput'}
                iconRight={
                  loading ? <Spinner size="normal" margin="0" /> : <Search />
                }
              />
              <DropdownMenu
                idField={idField}
                labelField={labelField}
                multiSelect={multiSelect}
                selectedItems={selectedItems}
                disableSelected={disableSelected}
                {...downshiftProps}
                items={items}
                totalCount={this.state.totalCount}
                positionAbsolute={positionAbsolute}
                inputValue={this.state.inputValue}
                onCreate={onCreate}
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
  labelField: PropTypes.string,
  idField: PropTypes.string,
  onClick: PropTypes.func,
  testid: PropTypes.string,
  positionAbsolute: PropTypes.bool,
  startOpen: PropTypes.bool,
  multiSelect: PropTypes.bool,
  selectedItems: PropTypes.array,
  disableSelected: PropTypes.bool,
  onCreate: PropTypes.func,
};

AsyncDropDown.defaultPropTypes = {
  placeholder: '',
  startOpen: false,
  multiSelect: false,
  selectedItems: [],
  disableSelected: false,
};

export default injectT(AsyncDropDown);
