/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { tagClasses } from './DropdownTag';

const DropdownTagPropertyItem = ({
  tagProperty,
  itemProperty,
  handleSetTagProperty,
}) => (
  <label
    {...tagClasses('radio', 'label')}
    htmlFor={tagProperty.name.toLowerCase()}>
    <input
      type="radio"
      value={tagProperty.id}
      onChange={e => handleSetTagProperty(e)}
      checked={itemProperty.id === tagProperty.id}
    />
    {tagProperty.name}
  </label>
);

DropdownTagPropertyItem.propTypes = {
  handleSetTagProperty: PropTypes.func,
  tagProperty: PropTypes.shape({}),
  itemProperty: PropTypes.shape({}),
};

export default DropdownTagPropertyItem;
