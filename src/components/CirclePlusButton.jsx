/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from 'ndla-button';
import PropTypes from 'prop-types';
import { Plus } from 'ndla-icons/action';
import { classes } from './Fields';

const CirclePlusButton = ({ onClick, disabled, ...rest }) => (
  <Button
    {...rest}
    {...classes('circle-button', disabled ? 'disabled' : 'eee')}
    disabled={disabled}
    stripped
    onClick={onClick}>
    <Plus className="c-icon--medium" />
  </Button>
);

CirclePlusButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CirclePlusButton.defaultProps = {
  disabled: false,
};

export default CirclePlusButton;
