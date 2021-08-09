/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Portal } from '../../../Portal';
import FileUploader from '../../../FileUploader';
import { UnsavedFile } from '../../../../interfaces';

interface Props {
  showFileUploader: boolean;
  onClose: () => void;
  onFileSave: (files: UnsavedFile[]) => void;
}

const AddFileToList = ({ showFileUploader, onClose, onFileSave, t }: Props & tType) =>
  showFileUploader ? (
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
  ) : null;

export default injectT(AddFileToList);
