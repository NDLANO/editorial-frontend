/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

export const tagClasses = new BEMHelper({
  name: 'tag',
  prefix: 'c-',
});

const Tag = ({ children, modifier }) => (
  <span {...tagClasses(undefined, modifier)}>{children}</span>
);

Tag.propTypes = {
  children: PropTypes.node,
  modifier: PropTypes.oneOf(
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ),
};

Tag.defaultProps = {
  modifier: '',
};

export default Tag;
