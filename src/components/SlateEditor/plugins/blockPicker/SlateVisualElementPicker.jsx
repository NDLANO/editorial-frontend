import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultBlocks } from '../../utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';

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
    <VisualElementModalWrapper resource={resource} isOpen onClose={onVisualElementClose}>
      {setH5pFetchFail => (
        <VisualElementSearch
          articleLanguage={articleLanguage}
          selectedResource={resource}
          handleVisualElementChange={onVisualElementAdd}
          closeModal={onVisualElementClose}
          setH5pFetchFail={setH5pFetchFail}
        />
      )}
    </VisualElementModalWrapper>
  );
};

SlateVisualElementPicker.propTypes = {
  articleLanguage: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  onVisualElementClose: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
};

export default injectT(SlateVisualElementPicker);
