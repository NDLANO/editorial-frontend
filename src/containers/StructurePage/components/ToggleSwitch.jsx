/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'toggleSwitch',
  prefix: 'c-',
});

const ToggleSwitch = ({ on, onClick, testId, large }) => (
  <label {...classes('', large && 'large')}>
    <input
      data-testid={testId}
      checked={on}
      onChange={onClick}
      type="checkbox"
    />
    <span {...classes('slider', large && 'large')} />
  </label>
);

ToggleSwitch.propTypes = {
  on: PropTypes.bool,
  onClick: PropTypes.func,
  testId: PropTypes.string,
  large: PropTypes.bool,
};

export default ToggleSwitch;
