import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import { StyledVisualElementModal } from '../../SlateEditor/plugins/blockPicker/SlateVisualElementPicker';

const DisplayExternalModal = ({
  isEditMode,
  allowedProvider,
  onEditEmbed,
  onClose,
  type,
  src,
  t,
}) => {
  const [h5pFetchFail, setH5pFetchFail] = useState(false);

  if (!isEditMode) {
    return null;
  }
  return (
    <StyledVisualElementModal
      narrow
      controllable
      isOpen={isEditMode}
      size={allowedProvider.name.toLowerCase() === 'h5p' ? 'fullscreen' : 'large'}
      backgroundColor="white"
      onClose={onClose}
      minHeight="85vh">
      {onCloseModal => (
        <Fragment>
          {(allowedProvider.name.toLowerCase() !== 'h5p' || h5pFetchFail) && (
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
            </ModalHeader>
          )}
          <ModalBody>
            <VisualElementSearch
              selectedResource={allowedProvider.name}
              selectedResourceUrl={src}
              selectedResourceType={type}
              handleVisualElementChange={onEditEmbed}
              closeModal={onClose}
              setH5pFetchFail={setH5pFetchFail}
            />
          </ModalBody>
        </Fragment>
      )}
    </StyledVisualElementModal>
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
