/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemEditField from './MenuItemEditField';
import { updateSubjectContentUri } from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';

class ChangeSubjectName extends Component {
  constructor() {
    super();
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onChangeSubjectName = this.onChangeSubjectName.bind(this);
  }

  async onChangeSubjectName(name) {
    const { id, contentUri, getAllSubjects, refreshTopics } = this.props;
    if (name.trim() !== '') {
      const ok = await updateSubjectContentUri(id, name, contentUri);
      getAllSubjects();
      refreshTopics();
      return ok;
    }
  }

  toggleEditMode() {
    this.props.toggleEditMode('changeSubjectName');
  }

  render() {
    const { editMode, t, name, onClose } = this.props;
    if (editMode === 'changeSubjectName') {
      return (
        <MenuItemEditField
          currentVal={name}
          messages={{ errorMessage: t('taxonomy.errorMessage') }}
          onSubmit={this.onChangeSubjectName}
          onClose={onClose}
          icon={<Pencil />}
        />
      );
    }
    return (
      <MenuItemButton
        stripped
        data-testid="changeSubjectNameButton"
        onClick={this.toggleEditMode}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.changeName')}
      </MenuItemButton>
    );
  }
}

ChangeSubjectName.propTypes = {
  toggleEditMode: PropTypes.func,
  onClose: PropTypes.func,
  editMode: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  getAllSubjects: PropTypes.func.isRequired,
  refreshTopics: PropTypes.func.isRequired,
};

export default injectT(ChangeSubjectName);
