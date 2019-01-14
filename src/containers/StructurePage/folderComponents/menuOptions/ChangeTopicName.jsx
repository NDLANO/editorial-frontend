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
import { Pencil } from '@ndla/icons/action';
import MenuItemEditField from './MenuItemEditField';
import RoundIcon from '../../../../components/RoundIcon';
import { updateTopic } from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';

class ChangeTopicName extends React.PureComponent {
  constructor() {
    super();
    this.onChangeTopicName = this.onChangeTopicName.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async onChangeTopicName(newName) {
    const { id, contentUri, refreshTopics } = this.props;
    try {
      await updateTopic({
        id,
        name: newName,
        contentUri,
      });
      refreshTopics();
    } catch (e) {
      throw new Error(e);
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('changeTopicName');
  }

  render() {
    const { name, t, onClose, editMode } = this.props;
    return editMode === 'changeTopicName' ? (
      <MenuItemEditField
        currentVal={name}
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onSubmit={this.onChangeTopicName}
        onClose={onClose}
        icon={<Pencil />}
      />
    ) : (
      <MenuItemButton
        stripped
        data-cy="change-topic-name"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName')}
      </MenuItemButton>
    );
  }
}

ChangeTopicName.propTypes = {
  toggleEditMode: PropTypes.func,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  name: PropTypes.string,
};

export default injectT(ChangeTopicName);
