import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Settings } from 'ndla-icons/editor';
import { Cross, Pencil } from 'ndla-icons/action';
import { injectT } from 'ndla-i18n';

import InlineEditField from './InlineEditField';

const SettingsMenuDropdown = ({ classes, onClose, t }) => {
  return (
    <div {...classes('openMenu')}>
      <div className={'header'}>
        <div {...classes('button', 'open')}>
          <Settings />
        </div>
        <span>{t('taxonomy.subjectSettings')}</span>
        <Button stripped {...classes('closeButton')} onClick={onClose}>
          <Cross />
        </Button>
      </div>
      <InlineEditField
        classes={classes}
        title={t('taxonomy.changeName')}
        icon={<Pencil />}
      />
    </div>
  );
};

SettingsMenuDropdown.propTypes = {};

export default injectT(SettingsMenuDropdown);
