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
      page: this.props.page,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePage = this.handlePage.bind(this);
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
    const { currentDebounce, page } = this.state;

    if (currentDebounce) {
      currentDebounce.cancel();
    }
    const debounced = debounce(() => this.handleSearch(value), 400);
    debounced();
    this.setState({
      page: page ? 1 : undefined,
      inputValue: value,
      currentDebounce: debounced,
    });
  }

  async handleSearch(query = '', page = this.state.page) {
    const { apiAction } = this.props;
    this.setState({ loading: true });
    const apiOutput = await apiAction(
      page ? { query: query, page: page } : query,
    );
    const items =
      (Array.isArray(apiOutput) ? apiOutput : apiOutput?.results) || [];
    const totalCount = apiOutput?.totalCount || null;
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

  async handlePageChange(page) {
    const { inputValue } = this.state;
    await this.handleSearch(inputValue, page.page);
    this.setState({
      page: page.page,
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
    if (this.props.children || this.props.clearInputField) {
      this.setState({ inputValue: '' });
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
      children,
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
      onKeyDown,
      removeItem,
      clearInputField,
      customCreateButtonText,
      hideTotalSearchCount,
      ...rest
    } = this.props;

    const { items, loading } = this.state;
    const inputProps = {
      placeholder,
      onChange: this.handleInputChange,
      onClick,
      value: this.state.inputValue,
      onKeyDown: this.props.onKeyDown
        ? this.props.onKeyDown
        : event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleCreate();
            }
          },
    };

    const handleCreate = () => {
      onCreate(this.state.inputValue);
      if (children || clearInputField) {
        this.setState({ inputValue: '' });
      }
    };

    return (
      <Downshift
        {...rest}
        itemToString={item => itemToString(item, labelField)}
        onStateChange={this.handleStateChange}
        onChange={this.handleChange}
        initialIsOpen={startOpen}
        selectedItem={this.state.selectedItem}
        isOpen={this.state.page && this.state.inputValue}>
        {({ getInputProps, openMenu, ...downshiftProps }) => {
          const inpProps = getInputProps({ ...inputProps });
          return (
            <div
              style={positionAbsolute ? { position: 'relative' } : undefined}>
              {children ? (
                children({ selectedItems, removeItem, ...inpProps })
              ) : (
                <Input
                  {...inpProps}
                  data-testid={'dropdownInput'}
                  iconRight={
                    loading ? <Spinner size="normal" margin="0" /> : <Search />
                  }
                />
              )}
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
                onCreate={onCreate && handleCreate}
                customCreateButtonText={customCreateButtonText}
                hideTotalSearchCount={hideTotalSearchCount}
                page={this.state.page}
                handlePageChange={this.handlePageChange}
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
  onKeyDown: PropTypes.func,
  children: PropTypes.func,
  removeItem: PropTypes.func,
  clearInputField: PropTypes.bool,
  customCreateButtonText: PropTypes.string,
  hideTotalSearchCount: PropTypes.bool,
  page: PropTypes.number,
};

AsyncDropDown.defaultPropTypes = {
  placeholder: '',
  startOpen: false,
  multiSelect: false,
  selectedItems: [],
  disableSelected: false,
  page: undefined,
};

export default injectT(AsyncDropDown);
