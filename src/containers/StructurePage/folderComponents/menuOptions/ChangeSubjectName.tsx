/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemEditField from './MenuItemEditField';
import { updateSubject } from '../../../../modules/taxonomy';
import MenuItemButton from './MenuItemButton';

const ChangeSubjectName = ({
  toggleEditMode,
  onClose,
  editMode,
  name,
  id,
  contentUri,
  getAllSubjects,
  refreshTopics,
  t,
}: Props & tType) => {
  const onChangeSubjectName = async (name: string): Promise<void> => {
    if (name && name.trim() !== '') {
      return updateSubject(id, name, contentUri)
        .then(() => getAllSubjects())
        .then(() => refreshTopics());
    }
  };
  if (editMode === 'changeSubjectName') {
    return (
      <MenuItemEditField
        autoFocus={true}
        currentVal={name}
        messages={{ errorMessage: t('taxonomy.errorMessage') }}
        onSubmit={onChangeSubjectName}
        onClose={onClose}
        icon={<Pencil />}
      />
    );
  }
  return (
    <MenuItemButton
      stripped
      data-testid="changeSubjectNameButton"
      onClick={() => toggleEditMode('changeSubjectName')}>
      <RoundIcon small icon={<Pencil />} />
      {t('taxonomy.changeName')}
    </MenuItemButton>
  );
};

interface Props {
  toggleEditMode: (s: string) => void;
  onClose: () => void;
  editMode: string;
  name: string;
  id: string;
  contentUri?: string;
  getAllSubjects: () => Promise<void>;
  refreshTopics: () => void;
}

ChangeSubjectName.propTypes = {
  toggleEditMode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  editMode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  getAllSubjects: PropTypes.func.isRequired,
  refreshTopics: PropTypes.func.isRequired,
};

export default injectT(ChangeSubjectName);
