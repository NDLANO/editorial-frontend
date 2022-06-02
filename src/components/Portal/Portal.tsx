/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import PortalContainer from './PortalContainer';

interface Props {
  isOpened?: Boolean;
}
class Portal extends Component<Props> {
  render() {
    if (!this.props.isOpened) return null;

    return <PortalContainer key="portal">{this.props.children}</PortalContainer>;
  }
}

export default Portal;
