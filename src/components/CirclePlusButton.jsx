/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import PropTypes from 'prop-types';
import { Plus } from 'ndla-icons/action';
import { classes } from './Fields';

const CirclePlusButton = ({ onClick }) => (
  <Button {...classes('circle-button')} stripped onClick={onClick}>
    <Plus className="c-icon--medium" />
  </Button>
);

CirclePlusButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CirclePlusButton;
