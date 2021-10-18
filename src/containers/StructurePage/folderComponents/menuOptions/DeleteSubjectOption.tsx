/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import AlertModal from '../../../../components/AlertModal';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import MenuItemButton from './MenuItemButton';
import '../../../../style/link.css';
import { StyledErrorMessage } from '../styles';
import { EditMode } from '../../../../interfaces';
import {
  useDeleteSubjectMutation,
  useSubjectTopics,
} from '../../../../modules/taxonomy/subjects/subjectsQueries';

interface Props {
  id: string;
  locale: string;
  editMode: EditMode;
  toggleEditMode: (mode: EditMode) => void;
}

const DeleteSubjectOption = ({ id, locale, editMode, toggleEditMode }: Props) => {
  const { t } = useTranslation();

  const { data: subjectTopics } = useSubjectTopics(id, locale, {
    enabled: editMode === 'deleteSubject',
  });
  const { mutate: deleteSubject, isLoading: loading, error } = useDeleteSubjectMutation();

  const enabled = subjectTopics && subjectTopics.length === 0;

  const onDeleteSubject = async () => {
    toggleEditMode('deleteTopic');
    deleteSubject(id);
  };

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="deleteSubjectOption"
        disabled={!enabled}
        onClick={() => toggleEditMode('deleteSubject')}>
        <RoundIcon small icon={<DeleteForever />} />
        {t('taxonomy.deleteSubject')}
      </MenuItemButton>
      <AlertModal
        show={editMode === 'deleteSubject'}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => toggleEditMode('deleteSubject'),
          },
          {
            text: t('alertModal.delete'),
            'data-testid': 'confirmDelete',
            onClick: onDeleteSubject,
          },
        ]}
        onCancel={() => toggleEditMode('deleteSubject')}
        text={t('taxonomy.confirmDeleteSubject')}
      />

      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">
          {/* @ts-ignore */}
          {`${t('taxonomy.errorMessage')}: ${error.message}`}
        </StyledErrorMessage>
      )}
    </>
  );
};

export default DeleteSubjectOption;
