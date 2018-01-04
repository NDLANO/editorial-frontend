/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { injectT } from 'ndla-i18n';
import { DropdownAction, DropdownMenu, DropdownInput, dropDownClasses } from './common';
import { itemToString } from '../../util/downShiftHelpers';

const Dropdown = ({
  name,
  items,
  defaultSelectedItem,
  selectedItem,
  onToggleMenu,
  onRemoveItem,
  onWrapperClick,
  inputWrapperRef,
  inputProps,
  multiSelect,
  textField,
  valueField,
  messages,
  ...rest
}) => (
  <Downshift
    {...rest}
    itemToString={item => itemToString(item, textField)}
    defaultSelectedItem={defaultSelectedItem}
    selectedItem={multiSelect ? selectedItem : undefined}
    render={downshiftProps => (
      <div {...dropDownClasses()}>
        <DropdownInput
          name={name}
          multiSelect={multiSelect}
          onRemoveItem={onRemoveItem}
          onWrapperClick={onWrapperClick}
          inputWrapperRef={inputWrapperRef}
          inputProps={inputProps}
          {...downshiftProps}
        />
        <DropdownMenu
          items={items}
          messages={messages}
          {...downshiftProps}
          textField={textField}
          valueField={valueField}
          multiSelect={multiSelect}
        />
        <DropdownAction
          onToggleMenu={onToggleMenu}
          multiSelect={multiSelect}
          {...downshiftProps}
        />
      </div>
    )}
  />
);

/*
  eslint-disable
*/
const requiredFieldIfItemsIsObjects = (props, propName, componentName) => {
  if (
    props.items.filter(item => !(item instanceof Object)).length === 0 &&
    !props[propName]
  ) {
    return new Error(
      `\`${propName}\` supplied to` +
        ` \`${componentName}\` must be defined if items consists of objects. Validation failed.`,
    );
  }
};
/*
  eslint-enable
*/
Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  messages: PropTypes.shape({
    emptyFilter: PropTypes.string.isRequired,
    emptyList: PropTypes.string.isRequired,
  }),
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
  ).isRequired,
  textField: requiredFieldIfItemsIsObjects,
  valueField: requiredFieldIfItemsIsObjects,
  defaultSelectedItem: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  selectedItem: PropTypes.arrayOf(PropTypes.shape),
  multiSelect: PropTypes.bool,
  onToggleMenu: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onWrapperClick: PropTypes.func,
  inputWrapperRef: PropTypes.func,
  inputProps: PropTypes.shape({}),
};

Dropdown.defaultProps = {
  multiSelect: false,
  onToggleMenu: undefined,
};

export default injectT(Dropdown);
