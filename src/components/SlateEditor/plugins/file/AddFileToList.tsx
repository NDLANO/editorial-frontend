/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Portal } from '../../../Portal';
import FileUploader from '../../../FileUploader';
import { UnsavedFile } from '../../../../interfaces';

interface Props {
  showFileUploader: boolean;
  onClose: () => void;
  onFileSave: (files: UnsavedFile[]) => void;
}

const AddFileToList = ({ showFileUploader, onClose, onFileSave }: Props) => {
  const { t } = useTranslation();
  if (!showFileUploader) {
    return null;
  }
  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={showFileUploader}
        size="medium"
        onClose={onClose}
        backgroundColor="white">
        {(onCloseModal: () => void) => (
          <>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
            </ModalHeader>
            <ModalBody>
              <FileUploader onFileSave={onFileSave} />
            </ModalBody>
          </>
        )}
      </Modal>
    </Portal>
  );
};

export default AddFileToList;
