/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { css } from 'react-emotion';
import { Settings } from '@ndla/icons/editor';
import { Cross } from '@ndla/icons/action';
import RoundIcon from '../../../components/RoundIcon';
import ChangeTopicName from './menuOptions/ChangeTopicName';
import AddExistingTopic from './menuOptions/AddExistingTopic';
import AddTopic from './menuOptions/AddTopic';
import ConnectFilterOption from './menuOptions/ConnectFilterOption';
import DeleteTopic from './menuOptions/DeleteTopic';
import ChangeSubjectName from './menuOptions/ChangeSubjectName';
import AddSubjectTopic from './menuOptions/AddSubjectTopic';
import AddExistingSubjectTopic from './menuOptions/AddExistingSubjectTopic';
import EditFilterOption from './menuOptions/EditFilterOption';

const closeButtonStyle = css`
  color: ${colors.brand.grey};
  margin-left: auto;
`;

const SettingsMenuDropdown = ({ classes, onClose, t, id, ...rest }) => {
  const type = id.includes('subject') ? 'subject' : 'topic';
  const sendDown = { classes, onClose, id, ...rest };
  return (
    <div {...classes('openMenu')}>
      <div className="header">
        <RoundIcon icon={<Settings />} open />
        <span>{t(`taxonomy.${type}Settings`)}</span>
        <Button stripped css={closeButtonStyle} onClick={onClose}>
          <Cross />
        </Button>
      </div>
      {type === 'subject' ? (
        <Fragment>
          <ChangeSubjectName {...sendDown} />
          <AddSubjectTopic {...sendDown} />
          <AddExistingSubjectTopic {...sendDown} />
          <EditFilterOption {...sendDown} />
        </Fragment>
      ) : (
        <Fragment>
          <ChangeTopicName {...sendDown} />
          <AddTopic {...sendDown} />
          <AddExistingTopic {...sendDown} />
          <ConnectFilterOption {...sendDown} />
          <DeleteTopic {...sendDown} />
        </Fragment>
      )}
    </div>
  );
};

SettingsMenuDropdown.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

export default injectT(SettingsMenuDropdown);
