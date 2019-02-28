import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { Portal } from '../../../Portal';
import FileUploader from '../../../FileUploader';

const AddFileToList = ({
  showFileUploader,
  onClose,
  onFileSave,
  addedFiles,
  t,
}) =>
  showFileUploader ? (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={showFileUploader}
        size="medium"
        onClose={onClose}
        backgroundColor="white">
        {onCloseModal => (
          <Fragment>
            <ModalHeader>
              <ModalCloseButton
                title={t('dialog.close')}
                onClick={onCloseModal}
              />
            </ModalHeader>
            <ModalBody>
              <FileUploader onClose={onClose} onFileSave={onFileSave} />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
    </Portal>
  ) : null;

AddFileToList.propTypes = {
  onFileSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showFileUploader: PropTypes.bool.isRequired,
  addedFiles: PropTypes.arrayOf(PropTypes.shape),
};

export default injectT(AddFileToList);
