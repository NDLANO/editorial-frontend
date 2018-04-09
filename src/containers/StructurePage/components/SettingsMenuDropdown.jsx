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
import { fetchTopics } from '../../../modules/taxonomy';
import { Cross, Pencil, Plus } from 'ndla-icons/action';

import InlineEditField from './InlineEditField';
import InlineDropdown from './InlineDropdown';

const SettingsMenuDropdown = ({
  classes,
  onClose,
  t,
  onChangeSubjectName,
  onAddSubjectTopic,
  onAddExistingTopic,
  id,
  name,
}) => {
  const type = id.includes('subject') ? 'subject' : 'topic';
  return (
    <div {...classes('openMenu')}>
      <div className={'header'}>
        <div {...classes('iconButton', 'open')}>
          <Settings />
        </div>
        <span>{t(`taxonomy.${type}Settings`)}</span>
        <Button stripped {...classes('closeButton')} onClick={onClose}>
          <Cross />
        </Button>
      </div>
      {type === 'subject' && (
        <InlineEditField
          classes={classes}
          currentVal={name}
          onSubmit={e => onChangeSubjectName(id, e)}
          onClose={onClose}
          title={t('taxonomy.changeName')}
          icon={<Pencil />}
        />
      )}
      {type === 'subject' && (
        <InlineEditField
          classes={classes}
          currentVal=""
          onClose={onClose}
          onSubmit={e => onAddSubjectTopic(id, e)}
          title={t('taxonomy.addTopic')}
          icon={<Plus />}
        />
      )}
      {type === 'subject' && (
        <InlineDropdown
          fetchItems={() => fetchTopics('nb')}
          classes={classes}
          onClose={onClose}
          onSubmit={e => onAddExistingTopic(id, e)}
          title={t('taxonomy.addExistingTopic')}
          icon={<Plus />}
          t={t}
        />
      )}
    </div>
  );
};

SettingsMenuDropdown.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  onAddSubjectTopic: PropTypes.func,
  onAddExistingTopic: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default SettingsMenuDropdown;
