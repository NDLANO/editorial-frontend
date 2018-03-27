import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenuDropdown from './SettingsMenuDropdown';

const classes = new BEMHelper({
  name: 'settingsMenu',
  prefix: 'c-',
});

class SettingsMenu extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    return (
      <div {...classes('')}>
        <Button {...classes('button')} onClick={this.toggleOpen} stripped>
          <Settings />
        </Button>
        {this.state.open && (
          <SettingsMenuDropdown onClose={this.toggleOpen} classes={classes} />
        )}
      </div>
    );
  }
}

SettingsMenu.propTypes = {};

export default SettingsMenu;
