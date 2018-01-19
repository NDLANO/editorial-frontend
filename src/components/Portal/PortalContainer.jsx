/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import { createPortal } from 'react-dom';

class PortalContainer extends Component {
  componentWillUnmount() {
    if (this.el) {
      document.body.removeChild(this.el);
    }
    this.el = null;
  }

  render() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.id = 'portal-root';
      document.body.appendChild(this.el);
    }
    return createPortal(this.props.children, this.el);
  }
}

export default PortalContainer;
