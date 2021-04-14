import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import VisualElementSearch from '../../../containers/VisualElement/VisualElementSearch';
import VisualElementModalWrapper from '../../../containers/VisualElement/VisualElementModalWrapper';

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
    <VisualElementModalWrapper
      resource={allowedProvider.name.toLowerCase()}
      isOpen={isEditMode}
      onClose={onClose}>
      {setH5pFetchFail => (
        <VisualElementSearch
          selectedResource={allowedProvider.name}
          selectedResourceUrl={src}
          selectedResourceType={type}
          handleVisualElementChange={onEditEmbed}
          closeModal={onClose}
          setH5pFetchFail={setH5pFetchFail}
        />
      )}
    </VisualElementModalWrapper>
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
