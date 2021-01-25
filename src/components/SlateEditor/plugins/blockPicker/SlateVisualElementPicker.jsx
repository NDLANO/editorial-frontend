import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultBlocks } from '../../utils';

const StyledModal = styled(Modal)`
  overflow: hidden;
  .modal-body {
    height: 90%;
  }
`;

const SlateVisualElementPicker = ({
  articleLanguage,
  resource,
  onVisualElementClose,
  onInsertBlock,
  t,
}) => {
  const onVisualElementAdd = (visualElement, type = 'embed') => {
    if (type === 'embed') {
      const blockToInsert = defaultBlocks.defaultEmbedBlock(visualElement);
      onInsertBlock(blockToInsert);
    } else if (type === 'file') {
      const blockToInsert = defaultBlocks.defaultFilesBlock({
        type: 'file',
        nodes: visualElement,
      });
      onInsertBlock(blockToInsert);
    }
    onVisualElementClose();
  };
  return (
    <StyledModal
      controllable
      isOpen
      narrow
      onClose={onVisualElementClose}
      size={resource === 'h5p' ? 'fullscreen' : 'large'}
      backgroundColor="white"
      minHeight={resource !== 'file' && '90vh'}>
      {onCloseModal => (
        <Fragment>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <VisualElementSearch
              articleLanguage={articleLanguage}
              selectedResource={resource}
              handleVisualElementChange={onVisualElementAdd}
              closeModal={onVisualElementClose}
            />
          </ModalBody>
        </Fragment>
      )}
    </StyledModal>
  );
};

SlateVisualElementPicker.propTypes = {
  articleLanguage: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  onVisualElementClose: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
};

export default injectT(SlateVisualElementPicker);
