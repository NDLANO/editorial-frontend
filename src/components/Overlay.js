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

const overlayClasses = new BEMHelper({
  name: 'overlay',
  prefix: 'c-',
});

const Overlay = ({ onExit, cssModifiers }) =>
  onExit ? (
    <div
      onClick={onExit}
      role="button"
      tabIndex={0}
      {...overlayClasses('', cssModifiers)}
    />
  ) : (
    <div {...overlayClasses('', cssModifiers)} />
  );

Overlay.propTypes = {
  onExit: PropTypes.func.isRequired,
  cssModifiers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Overlay.defaultProps = {
  cssModifiers: '',
};

export default Overlay;
