/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ChangeTopicName from './menuOptions/ChangeTopicName';
import AddExistingTopic from './menuOptions/AddExistingTopic';
import AddTopic from './menuOptions/AddTopic';
import ConnectFilterOption from './menuOptions/ConnectFilterOption';
import DeleteTopic from './menuOptions/DeleteTopic';
import ChangeSubjectName from './menuOptions/ChangeSubjectName';
import AddSubjectTopic from './menuOptions/AddSubjectTopic';
import AddExistingSubjectTopic from './menuOptions/AddExistingSubjectTopic';
import EditFilterOption from './menuOptions/EditFilterOption';

const SettingsMenuDropdownType = ({ classes, settingsMenuType, ...rest }) => {
  switch (settingsMenuType) {
    case 'subject':
      return (
        <Fragment>
          <ChangeSubjectName {...rest} />
          <AddSubjectTopic {...rest} />
          <AddExistingSubjectTopic {...rest} />
          <EditFilterOption classes={classes} {...rest} />
        </Fragment>
      );
    case 'topic':
      return (
        <Fragment>
          <ChangeTopicName {...rest} />
          <AddTopic {...rest} />
          <AddExistingTopic {...rest} />
          <ConnectFilterOption classes={classes} {...rest} />
          <DeleteTopic {...rest} />
        </Fragment>
      );
    default:
      return null;
  }
};

SettingsMenuDropdownType.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  settingsMenuType: PropTypes.oneOf(['topic', 'subject']),
};

export default SettingsMenuDropdownType;
