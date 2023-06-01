/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ModalHeader, ModalBody, ModalCloseButton, Modal } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { CodeBlockEditor } from '@ndla/code';
import { CodeEmbedData } from '@ndla/types-embed';
import AlertModal from '../../../AlertModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  handleCancelDiscard: () => void;
  handleContinue: () => void;
  handleExit: () => void;
  handleSave: (code: CodeBlockType) => void;
  embedData: CodeEmbedData;
  openDiscardModal: boolean;
}

const EditCodeBlockModal = ({
  handleCancelDiscard,
  handleContinue,
  handleExit,
  handleSave,
  embedData,
  openDiscardModal,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      aria-label={t('codeEditor.subtitle')}
      controlled
      isOpen
      size={{ width: 'large', height: 'large' }}
      onClose={handleExit}
    >
      {(onCloseModal: any) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <CodeBlockEditor
              content={{
                code: embedData.codeContent,
                format: embedData.codeFormat,
                title: embedData.title || '',
              }}
              onSave={handleSave}
              onAbort={handleExit}
            />

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
