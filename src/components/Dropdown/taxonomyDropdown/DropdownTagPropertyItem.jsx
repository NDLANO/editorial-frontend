/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { tagClasses } from '../../Tag';

const DropdownTagPropertyItem = ({
  name,
  checked,
  id,
  handleSetTagProperty,
}) => (
  <label
    {...tagClasses('radio', 'label')}
    id="tag-input-label"
    htmlFor={name.toLowerCase()}>
    <input
      type="radio"
      onChange={() => handleSetTagProperty(id)}
      checked={checked}
    />
    {name}
  </label>
);

DropdownTagPropertyItem.propTypes = {
  handleSetTagProperty: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  checked: PropTypes.bool,
};

export default DropdownTagPropertyItem;
