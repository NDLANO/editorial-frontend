import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { css } from '@emotion/react';
import { injectT } from '@ndla/i18n';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';

const DisplayExternalModal = ({
  isEditMode,
  allowedProvider,
  onEditEmbed,
  onClose,
  type,
  src,
  t,
}) => {
  if (!isEditMode) {
    return null;
  }
  return (
    <Modal
      css={css`
        overflow: hidden;
        .modal-body {
          height: 90%;
          overflow: hidden;
        }
      `}
      controllable
      isOpen={isEditMode}
      size={allowedProvider.name.toLowerCase() === 'h5p' ? 'fullscreen' : 'large'}
      backgroundColor="white"
      onClose={onClose}
      minHeight="85vh">
      {onCloseModal => (
        <Fragment>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <VisualElementSearch
              selectedResource={allowedProvider.name}
              selectedResourceUrl={src}
              selectedResourceType={type}
              handleVisualElementChange={onEditEmbed}
              closeModal={onClose}
            />
          </ModalBody>
        </Fragment>
      )}
    </Modal>
  );
};

DisplayExternalModal.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onEditEmbed: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  allowedProvider: PropTypes.shape({
    height: PropTypes.string,
    name: PropTypes.string.isRequired,
    url: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default injectT(DisplayExternalModal);
