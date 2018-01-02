/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import BEMHelper from 'react-bem-helper';
import { injectT } from 'ndla-i18n';
import DropDownAction from './DropDownAction';
import DropDownMenu from './DropDownMenu';
import DropDownInput from './DropDownInput';
import { itemToString } from '../../util/downShifhtHelpers';

export const dropDownClasses = new BEMHelper({
  name: 'dropdown',
  prefix: 'c-',
});

const DropDown = ({
  items,
  defaultSelectedItem,
  onChange,
  textField,
  valueField,
  onInputChange,
}) => (
  <Downshift
    onChange={onChange}
    itemToString={item => itemToString(item, textField)}
    defaultSelectedItem={defaultSelectedItem}
    render={downshiftProps => (
      <div {...dropDownClasses()}>
        <DropDownInput {...downshiftProps} onInputChange={onInputChange} />
        <DropDownMenu
          items={items}
          {...downshiftProps}
          textField={textField}
          valueField={valueField}
        />
        <DropDownAction {...downshiftProps} />
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
DropDown.propTypes = {
  onChange: PropTypes.func.isRequired,
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
  onInputChange: PropTypes.func.isRequired,
};

export default injectT(DropDown);
