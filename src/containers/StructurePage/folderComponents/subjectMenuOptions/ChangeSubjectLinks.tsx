/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CloseButton } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@ndla/modal';
import { Node, NodeType } from '@ndla/types-taxonomy';

import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import { StyledErrorMessage } from '../styles';
import { useFetchSubjectpageData } from '../../../FormikForm/formikSubjectpageHooks';
import RoundIcon from '../../../../components/RoundIcon';
import Spinner from '../../../../components/Spinner';

interface Props {
  node: Node;
  editModeHandler: EditModeHandler;
}

const ChangeSubjectLinks = ({ editModeHandler: { editMode, toggleEditMode }, node }: Props) => {
  const { t } = useTranslation();

  const onModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        toggleEditMode('changeSubjectLinks');
      } else toggleEditMode('');
    },
    [toggleEditMode],
  );

  const onClose = useCallback(() => {
    toggleEditMode('');
  }, [toggleEditMode]);

  return (
    <>
      <Modal open={editMode === 'changeSubjectLinks'} onOpenChange={onModalChange}>
        <ModalTrigger>
          <MenuItemButton data-testid="changeSubjetLinksButton">
            <RoundIcon small icon={<Pencil />} />
            {t('taxonomy.changeSubjectLinks.buttonTitle')}
          </MenuItemButton>
        </ModalTrigger>
        <ModalContent>
          <ChangeSubjectLinksContent node={node} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  node: Node;
  nodeType?: NodeType;
}

const ChangeSubjectLinksContent = ({ onClose, node, nodeType = 'SUBJECT' }: ModalProps) => {
  const { t } = useTranslation();
  const [loadError, setLoadError] = useState('');
  const { id, contentUri } = node;

  const { loading, subjectpage, updateSubjectpage } = useFetchSubjectpageData(
    id,
    'nb',
    contentUri?.split(':').pop(),
  );

  if (loading) {
    return <Spinner />;
  }

  console.log(subjectpage);

  const initialValues = {
    connectedTo: subjectpage?.connectedTo ?? [],
    buildsOn: subjectpage?.buildsOn ?? [],
    leadsTo: subjectpage?.leadsTo ?? [],
  };

  if (loadError) {
    return <StyledErrorMessage>{loadError}</StyledErrorMessage>;
  }

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t('taxonomy.changeSubjectLinks.title')}</ModalTitle>
        <CloseButton title={t('dialog.close')} data-testid="close-modal-button" onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <Formik initialValues={initialValues} onSubmit={(_, __) => {}}></Formik>
      </ModalBody>
    </>
  );
};

export default ChangeSubjectLinks;
