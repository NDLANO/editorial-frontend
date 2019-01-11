/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import Button from '@ndla/button';
import PropTypes from 'prop-types';
import { Settings } from '@ndla/icons/editor';
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
      editMode: '',
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.toggleOpenMenu = this.toggleOpenMenu.bind(this);
  }

  toggleEditMode(name) {
    this.setState(prevState => ({
      editMode: name === prevState.editMode ? '' : name,
    }));
  }

  toggleOpenMenu() {
    this.setState(prevState => ({
      open: !prevState.open,
    }));
  }

  render() {
    const { editMode, open } = this.state;
    return (
      <div {...classes('')}>
        <Button
          onClick={this.toggleOpenMenu}
          data-cy={`settings-button-${this.props.type}`}
          stripped>
          <RoundIcon icon={<Settings />} margin />
        </Button>
        {open && (
          <Fragment>
            <Overlay onExit={this.toggleOpenMenu} />
            <SettingsMenuDropdown
              onClose={this.toggleOpenMenu}
              classes={classes}
              {...this.props}
              toggleEditMode={this.toggleEditMode}
              editMode={editMode}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

SettingsMenu.propTypes = {
  type: PropTypes.string,
};

export default SettingsMenu;
