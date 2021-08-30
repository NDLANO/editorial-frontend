/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  AddExistingToTopic,
  AddExistingToSubjectTopic,
  ChangeSubjectName,
  CopyResources,
  DeleteTopic,
  DeleteSubjectOption,
  EditGrepCodes,
  PublishTopic,
  ToggleVisibility,
  EditSubjectpageOption,
  EditCustomFields,
} from './menuOptions';

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
              <DeleteSubjectOption {...rest} />
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
