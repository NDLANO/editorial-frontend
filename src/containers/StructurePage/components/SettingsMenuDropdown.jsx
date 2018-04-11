import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import { Cross, Pencil } from 'ndla-icons/action';

import InlineEditField from './InlineEditField';
import RoundIcon from './RoundIcon';

const SettingsMenuDropdown = ({
  classes,
  onClose,
  t,
  onChangeSubjectName,
  id,
  name,
  type,
}) => (
  <div {...classes('openMenu')}>
    <div className="header">
      <RoundIcon icon={<Settings />} open />
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
        t={t}
      />
    )}
  </div>
);

SettingsMenuDropdown.propTypes = {
  classes: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
  onChangeSubjectName: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

export default SettingsMenuDropdown;
