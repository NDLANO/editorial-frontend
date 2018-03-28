import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenuDropdown from './SettingsMenuDropdown';

const classes = new BEMHelper({
  name: 'settingsMenu',
  prefix: 'c-',
});

const SettingsMenu = ({ toggleState, id, toggles, ...rest }) => {
  const toggleId = `settings-${id}`;
  return (
    <div {...classes('')}>
      <Button
        {...classes('iconButton')}
        onClick={() => toggleState(toggleId)}
        stripped>
        <Settings />
      </Button>
      {toggles[toggleId] && (
        <SettingsMenuDropdown
          onClose={() => toggleState(toggleId)}
          classes={classes}
          {...{ id, ...rest }}
        />
      )}
    </div>
  );
};

SettingsMenu.propTypes = {
  toggleState: PropTypes.func,
  id: PropTypes.string,
  toggles: PropTypes.objectOf(PropTypes.string),
};

export default SettingsMenu;
