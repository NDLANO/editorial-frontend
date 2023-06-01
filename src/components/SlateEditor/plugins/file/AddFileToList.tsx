/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { ModalHeader, ModalBody, ModalCloseButton, Modal } from '@ndla/modal';
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
        aria-label={t('form.file.addFile')}
        controlled
        isOpen={showFileUploader}
        size="normal"
        onClose={onClose}
      >
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
