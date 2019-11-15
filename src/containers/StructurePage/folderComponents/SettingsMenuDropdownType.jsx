/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AddTopic from './menuOptions/AddTopic';
import ConnectFilterOption from './menuOptions/ConnectFilterOption';
import DeleteTopic from './menuOptions/DeleteTopic';
import ChangeSubjectName from './menuOptions/ChangeSubjectName';
import EditFilterOption from './menuOptions/EditFilterOption';
import AddExistingTopic from './menuOptions/AddExistingTopic';
import AddExistingSubjectTopic from './menuOptions/AddExistingSubjectTopic';

const SettingsMenuDropdownType = ({
  settingsMenuType,
  showAllOptions,
  ...rest
}) => {
  switch (settingsMenuType) {
    case 'subject':
      return (
        <>
          <ChangeSubjectName {...rest} />
          {showAllOptions && (
            <>
              <EditFilterOption {...rest} />
              <AddExistingSubjectTopic {...rest} />
            </>
          )}
        </>
      );
    case 'topic':
      return (
        <>
          {false && <AddTopic {...rest} />}
          <ConnectFilterOption {...rest} />
          {showAllOptions && (
            <>
              <DeleteTopic {...rest} />
              <AddExistingTopic {...rest} />
            </>
          )}
        </>
      );
    default:
      return null;
  }
};

SettingsMenuDropdownType.propTypes = {
  onClose: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  settingsMenuType: PropTypes.oneOf(['topic', 'subject']),
  showAllOptions: PropTypes.bool,
};

export default SettingsMenuDropdownType;
