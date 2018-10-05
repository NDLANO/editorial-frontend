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
import { Settings } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenuDropdown from './SettingsMenuDropdown';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';

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
          onClick={() => this.setState({ open: true })}
          data-cy={`settings-button-${this.props.type}`}
          stripped>
          <RoundIcon icon={<Settings />} margin />
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

SettingsMenu.propTypes = {
  type: PropTypes.string,
};

export default SettingsMenu;
