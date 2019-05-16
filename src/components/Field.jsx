/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const Field = ({ children, className, noBorder, title, right }) => (
  <div {...classes('', { 'no-border': noBorder, right, title }, className)}>
    {children}
  </div>
);

Field.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
};

Field.defaultProps = {
  noBorder: false,
};

export default Field;
