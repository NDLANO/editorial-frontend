/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT, tType } from '@ndla/i18n';
import { CodeBlockEditor } from '@ndla/editor';
import AlertModal from '../../../AlertModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  handleCancelDiscard: Function;
  handleContinue: Function;
  handleExit: Function;
  handleRemove: Function;
  handleSave: Function;
  model: CodeBlockType;
  openDiscardModal: boolean;
}

const EditCodeBlockModal: FC<Props & tType> = ({
  handleCancelDiscard,
  handleContinue,
  handleExit,
  handleRemove,
  handleSave,
  model,
  openDiscardModal,
  t,
}) => (
  <Modal
    narrow
    controllable
    isOpen
    size="large"
    backgroundColor="white"
    onClose={handleExit}
    minHeight="90vh">
    {(onCloseModal: any) => (
      <>
        <ModalHeader>
          <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
        </ModalHeader>
        <ModalBody>
          <CodeBlockEditor
            content={model}
            onSave={handleSave}
            onAbort={handleExit}
          />

          <AlertModal
            show={openDiscardModal}
            text={t('mathEditor.continue')}
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

export default injectT(EditCodeBlockModal);
