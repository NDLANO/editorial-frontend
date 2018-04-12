/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import { Cross } from 'ndla-icons/action';
import SubjectSettingsItems from './SubjectSettingsItems';
import TopicSettingItems from './TopicSettingItems';

const SettingsMenuDropdown = ({ classes, onClose, t, id, ...rest }) => {
  const type = id.includes('subject') ? 'subject' : 'topic';
  return (
    <div {...classes('openMenu')}>
      <div className="header">
        <div {...classes('iconButton', 'open')}>
          <Settings />
        </div>
        <span>{t(`taxonomy.${type}Settings`)}</span>
        <Button stripped {...classes('closeButton')} onClick={onClose}>
          <Cross />
        </Button>
      </div>
      {type === 'subject' ? (
        <SubjectSettingsItems
          classes={classes}
          onClose={onClose}
          id={id}
          {...rest}
        />
      ) : (
        <TopicSettingItems />
      )}
    </div>
    {type === 'subject' && (
      <InlineEditField
        classes={classes}
        currentVal={name}
        onSubmit={e => onChangeSubjectName(id, e)}
        onClose={onClose}
        title={t('taxonomy.changeName')}
        icon={<Pencil />}
        t={t}
      />
    )}
  </div>
);

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
