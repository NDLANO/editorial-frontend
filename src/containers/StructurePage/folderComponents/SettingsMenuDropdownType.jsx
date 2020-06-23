/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import AddExistingToTopic from './menuOptions/AddExistingToTopic';
import AddExistingToSubjectTopic from './menuOptions/AddExistingToSubjectTopic';
import ChangeSubjectName from './menuOptions/ChangeSubjectName';
import ConnectFilterOption from './menuOptions/ConnectFilterOption';
import CopyResources from './menuOptions/CopyResources';
import DeleteTopic from './menuOptions/DeleteTopic';
import EditFilterOption from './menuOptions/EditFilterOption';
import EditGrepCodes from './menuOptions/EditGrepCodes';
import PublishTopic from './menuOptions/PublishTopic';
import ToggleVisibility from './menuOptions/ToggleVisibility';
import EditSubjectFrontPageOption from './menuOptions/EditSubjectFrontpageOption';

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
              <AddExistingToSubjectTopic {...rest} />
              <ToggleVisibility {...rest} menuType={settingsMenuType} />
              <EditGrepCodes {...rest} menuType={settingsMenuType} />
              <EditSubjectFrontPageOption {...rest} />
            </>
          )}
        </>
      );
    case 'topic':
      return (
        <>
          {showAllOptions && <PublishTopic {...rest} />}
          <ConnectFilterOption {...rest} />
          {showAllOptions && (
            <>
              <DeleteTopic {...rest} />
              <AddExistingToTopic {...rest} />
              <ToggleVisibility {...rest} menuType={settingsMenuType} />
              <EditGrepCodes {...rest} menuType={settingsMenuType} />
            </>
          )}
          {showAllOptions && <CopyResources {...rest} />}
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
