/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Pencil } from '@ndla/icons/action';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { Node, NodeType } from '@ndla/types-taxonomy';

import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';

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
  return <div>Test</div>;
};

export default ChangeSubjectLinks;
