import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultBlocks } from '../../utils';

const SlateVisualElementPicker = ({
  isOpen,
  resource,
  onVisualElementClose,
  onInsertBlock,
  t,
}) => {
  if (!isOpen) {
    return null;
  }
  const onVisualElementAdd = (visualElement, type = 'embed') => {
    if (type === 'embed') {
      const blockToInsert = defaultBlocks.defaultEmbedBlock(visualElement);
      onInsertBlock(blockToInsert);
    } else if (type === 'file') {
      const blockToInsert = defaultBlocks.defaultFilesBlock({
        type: 'file',
        nodes: [visualElement],
      });
      onInsertBlock(blockToInsert);
    }
    onVisualElementClose();
  };
  return (
    <Modal
      controllable
      isOpen={isOpen}
      onClose={onVisualElementClose}
      size={resource === 'h5p' ? 'fullscreen' : 'large'}
      backgroundColor="white"
      minHeight="90vh">
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
              handleVisualElementChange={onVisualElementAdd}
              closeModal={onVisualElementClose}
            />
          </ModalBody>
        </Fragment>
      )}
    </Modal>
  );
};

SlateVisualElementPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  resource: PropTypes.string.isRequired,
  onVisualElementClose: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
};

export default injectT(SlateVisualElementPicker);
