/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import AlertModal from '../../../../components/AlertModal';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import handleError from '../../../../util/handleError';
import MenuItemButton from './MenuItemButton';
import { fetchSubjectTopics, deleteSubject } from '../../../../modules/taxonomy';
import '../../../../style/link.css';
import { StyledErrorMessage } from '../styles';
import { SubjectTopic } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

import { EditMode } from '../../../../interfaces';

interface Props {
  id: string;
  locale: string;
  editMode: string;
  toggleEditMode: (mode: EditMode) => void;
  getAllSubjects: () => Promise<void>;
}

const DeleteSubjectOption = ({ id, locale, editMode, toggleEditMode, getAllSubjects }: Props) => {
  const { t } = useTranslation();
  const [subjectTopics, setSubjectTopics] = useState<SubjectTopic[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const enabled = subjectTopics && subjectTopics.length === 0;

  useEffect(() => {
    const fetchSubject = async () => {
      const fetchedSubjectTopics = await fetchSubjectTopics(id, locale);
      setSubjectTopics(fetchedSubjectTopics);
    };
    fetchSubject();
  }, [id, locale]);

  const onDeleteSubject = async () => {
    toggleEditMode('deleteTopic');
    setLoading(true);
    setError('');
    try {
      await deleteSubject(id);
      getAllSubjects();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(`${t('taxonomy.errorMessage')}: ${err.message}`);

      handleError(err);
    }
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
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
      )}
    </>
  );
};

export default DeleteSubjectOption;
