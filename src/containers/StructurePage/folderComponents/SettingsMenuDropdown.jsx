/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button'; //checked
import { colors } from '@ndla/core';
import { css } from 'react-emotion';
import { Settings } from '@ndla/icons/editor';
import { Cross } from '@ndla/icons/action';
import RoundIcon from '../../../components/RoundIcon';
import SettingsMenuDropdownType from './SettingsMenuDropdownType';

const closeButtonStyle = css`
  color: ${colors.brand.grey};
  margin-left: auto;
`;

const SettingsMenuDropdown = ({ classes, onClose, t, id, ...rest }) => {
  const settingsMenuType = id.includes('subject') ? 'subject' : 'topic';
  return (
    <div {...classes('openMenu')}>
      <div className="header">
        <RoundIcon icon={<Settings />} open />
        <span>{t(`taxonomy.${settingsMenuType}Settings`)}</span>
        <Button stripped css={closeButtonStyle} onClick={onClose}>
          <Cross />
        </Button>
      </div>
      <SettingsMenuDropdownType
        onClose={onClose}
        classes={classes}
        id={id}
        {...rest}
        settingsMenuType={settingsMenuType}
      />
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
