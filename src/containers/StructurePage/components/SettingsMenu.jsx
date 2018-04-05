/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import SettingsMenuDropdown from './SettingsMenuDropdown';
import Overlay from '../../../components/Overlay';

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
        <React.Fragment>
          <Overlay onExit={() => toggleState(toggleId)} />
          <SettingsMenuDropdown
            onClose={() => toggleState(toggleId)}
            classes={classes}
            {...{ id, ...rest }}
          />
        </React.Fragment>
      )}
    </div>
  );
};

SettingsMenu.propTypes = {
  toggleState: PropTypes.func,
  id: PropTypes.string,
  toggles: PropTypes.objectOf(PropTypes.bool),
};

export default SettingsMenu;
