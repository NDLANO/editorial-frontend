import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import VisualElementSearch from '../../../../containers/VisualElement/VisualElementSearch';
import { defaultEmbedBlock } from '../embed/utils';
import { defaultFileBlock } from '../file/utils';
import VisualElementModalWrapper from '../../../../containers/VisualElement/VisualElementModalWrapper';
import { onSaveAsMetaImage } from '../../../../containers/VisualElement/VisualElementSelectField';

const SlateVisualElementPicker = ({
  articleLanguage,
  resource,
  onVisualElementClose,
  onInsertBlock,
}) => {
  const formikContext = useFormikContext();

  const onVisualElementAdd = (visualElement, type = 'embed') => {
    if (type === 'embed') {
      const blockToInsert = defaultEmbedBlock(visualElement);
      onInsertBlock(blockToInsert);
    } else if (type === 'file') {
      const blockToInsert = defaultFileBlock(visualElement);
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
          showMetaImageCheckbox={true}
          onSaveAsMetaImage={image => onSaveAsMetaImage(image, formikContext)}
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

export default SlateVisualElementPicker;
