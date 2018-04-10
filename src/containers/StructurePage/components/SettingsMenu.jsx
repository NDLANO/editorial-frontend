/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenuDropdown from './SettingsMenuDropdown';
import Overlay from '../../../components/Overlay';

const classes = new BEMHelper({
  name: 'settingsMenu',
  prefix: 'c-',
});

class SettingsMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <div {...classes('')}>
        <Button
          {...classes('iconButton')}
          onClick={() => this.setState({ open: true })}
          stripped>
          <Settings />
        </Button>
        {this.state.open && (
          <React.Fragment>
            <Overlay onExit={() => this.setState({ open: false })} />
            <SettingsMenuDropdown
              onClose={() => this.setState({ open: false })}
              classes={classes}
              {...this.props}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default SettingsMenu;
