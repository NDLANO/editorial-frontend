import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from 'ndla-modal';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultBlocks } from '../../utils';

const SlateEmbedPicker = ({
  isOpen,
  resource,
  onEmbedClose,
  onInsertBlock,
  t,
}) => {
  const onEmbedAdd = embed => {
    const blockToInsert = defaultBlocks.defaultEmbedBlock(embed);
    onInsertBlock(blockToInsert);
    onEmbedClose();
  };
  return (
    <Modal
      controllable
      isOpen={isOpen}
      onClose={onEmbedClose}
      size={resource === 'h5p' ? 'fullscreen' : 'large'}
      backgroundColor="white"
      minHeight="85vh">
      {onCloseModal => (
        <Fragment>
          <ModalHeader>
            <ModalCloseButton
              title={t('dialog.close')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <VisualElementSearch
              selectedResource={resource}
              handleVisualElementChange={onEmbedAdd}
              closeModal={onEmbedClose}
            />
          </ModalBody>
        </Fragment>
      )}
    </Modal>
  );
};

SlateEmbedPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  resource: PropTypes.string.isRequired,
  onEmbedClose: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
};

export default injectT(SlateEmbedPicker);
