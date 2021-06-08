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
import CopyResources from './menuOptions/CopyResources';
import DeleteTopic from './menuOptions/DeleteTopic';
import EditGrepCodes from './menuOptions/EditGrepCodes';
import PublishTopic from './menuOptions/PublishTopic';
import ToggleVisibility from './menuOptions/ToggleVisibility';
import EditSubjectpageOption from './menuOptions/EditSubjectpageOption';
import EditCustomFields from './menuOptions/EditCustomFields';

const SettingsMenuDropdownType = ({
  settingsMenuType,
  showAllOptions,
  setShowAlertModal,
  ...rest
}) => {
  switch (settingsMenuType) {
    case 'subject':
      return (
        <>
          <ChangeSubjectName {...rest} />
          {showAllOptions && (
            <>
              <EditCustomFields {...rest} type={settingsMenuType} />
              <AddExistingToSubjectTopic {...rest} />
              <ToggleVisibility {...rest} menuType={settingsMenuType} />
              <EditGrepCodes {...rest} menuType={settingsMenuType} />
              <EditSubjectpageOption {...rest} />
            </>
          )}
        </>
      );
    case 'topic':
      return (
        <>
          {showAllOptions && <PublishTopic {...rest} />}
          {showAllOptions && (
            <>
              <EditCustomFields {...rest} type={settingsMenuType} />
              <DeleteTopic {...rest} />
              <AddExistingToTopic {...rest} />
              <ToggleVisibility {...rest} menuType={settingsMenuType} />
              <EditGrepCodes {...rest} menuType={settingsMenuType} />
            </>
          )}
          {showAllOptions && <CopyResources {...rest} setShowAlertModal={setShowAlertModal} />}
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
  setShowAlertModal: PropTypes.func,
};

export default SettingsMenuDropdownType;
