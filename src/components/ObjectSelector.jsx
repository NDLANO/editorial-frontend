/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';

const ObjectSelector = props => {
  const {
    options,
    labelKey,
    idKey,
    disabled,
    onChange,
    onBlur,
    value,
    emptyField,
    placeholder,
    ...rest
  } = props;
  return (
    <select
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      disabled={disabled}
      {...rest}>
      {emptyField ? <option value="">{placeholder}</option> : ''}
      {options.map(option => (
        <option
          key={option[idKey] ? option[idKey] : uuid()}
          value={option[idKey]}>
          {option[labelKey]}
        </option>
      ))}
    </select>
  );
};

ObjectSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  labelKey: PropTypes.string.isRequired,
  idKey: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  emptyField: PropTypes.bool,
  placeholder: PropTypes.string,
};

ObjectSelector.defaultProps = {
  disabled: false,
  emptyField: false,
  className: '',
  placeholder: '',
};

export default ObjectSelector;
