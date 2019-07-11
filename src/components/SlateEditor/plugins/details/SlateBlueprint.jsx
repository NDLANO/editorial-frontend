/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Details from './Details';

const SlateBlueprint = ({ attributes, children, ...rest }) => (
  <div draggable {...attributes}>
    <Details {...rest}>{children}</Details>
  </div>
);

SlateBlueprint.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default SlateBlueprint;
