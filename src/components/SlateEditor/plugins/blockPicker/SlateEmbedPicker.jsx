import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../../Lightbox';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../../schema';

const SlateEmbedPicker = ({
  isOpen,
  resource,
  onEmbedClose,
  onInsertBlock,
}) => {
  const onEmbedAdd = embed => {
    const blockToInsert = defaultEmbedBlock(embed);
    onInsertBlock(blockToInsert);
    onEmbedClose();
  };
  return (
    <Lightbox
      display={isOpen}
      fullscreen={resource === 'h5p'}
      big
      onClose={onEmbedClose}>
      <VisualElementSearch
        selectedResource={resource}
        handleVisualElementChange={onEmbedAdd}
        closeModal={onEmbedClose}
      />
    </Lightbox>
  );
};

SlateEmbedPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  resource: PropTypes.string.isRequired,
  onEmbedClose: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
};

export default SlateEmbedPicker;
