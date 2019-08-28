/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PortalContainer from './PortalContainer';

class Portal extends Component {
  render() {
    if (!this.props.isOpened) return null;

    return (
      <PortalContainer key="portal">{this.props.children}</PortalContainer>
    );
  }
}

Portal.propTypes = {
  isOpened: PropTypes.bool,
};

export default Portal;
