/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { CodeBlockEditor } from '@ndla/code';
import AlertModal from '../../../AlertModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  handleCancelDiscard: () => void;
  handleContinue: () => void;
  handleExit: () => void;
  handleSave: (code: CodeBlockType) => void;
  model: CodeBlockType;
  openDiscardModal: boolean;
}

const EditCodeBlockModal = ({
  handleCancelDiscard,
  handleContinue,
  handleExit,
  handleSave,
  model,
  openDiscardModal,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      label={t('codeEditor.subtitle')}
      narrow
      controllable
      isOpen
      size="large"
      backgroundColor="white"
      onClose={handleExit}
      minHeight="90vh"
    >
      {(onCloseModal: any) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <CodeBlockEditor content={model} onSave={handleSave} onAbort={handleExit} />

            <AlertModal
              title={t('unsavedChanges')}
              label={t('unsavedChanges')}
              show={openDiscardModal}
              text={t('code.continue')}
              actions={[
                {
                  text: t('form.abort'),
                  onClick: handleCancelDiscard,
                },
                {
                  text: t('alertModal.continue'),
                  onClick: handleContinue,
                },
              ]}
              onCancel={handleCancelDiscard}
            />
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default EditCodeBlockModal;
