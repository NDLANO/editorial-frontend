/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'spinner',
  prefix: 'c-',
});

const Spinner = ({ cssModifier }) => <div {...classes('', cssModifier)} />;

Spinner.propTypes = {
  cssModifier: PropTypes.string,
};

Spinner.defaultProps = {
  cssModifier: '',
};

export default Spinner;
