/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import VisualElementSearch from './VisualElementSearch';
import VisualElementModalWrapper from './VisualElementModalWrapper';

export const onSaveAsMetaImage = (image, formikContext) => {
  const { setFieldValue } = formikContext;

  if (setFieldValue && image) {
    setTimeout(() => {
      setFieldValue('metaImageId', image.id || '');
      setFieldValue('metaImageAlt', image.alttext?.alttext || '');
    }, 0);
  }
};

const VisualElementSelectField = ({
  resetSelectedResource,
  onChange,
  name,
  videoTypes,
  articleLanguage,
  selectedResource,
}) => {
  const formikContext = useFormikContext();

  const { values } = formikContext;

  const showMetaImageCheckbox =
    values.metaImageAlt !== undefined && values.metaImageId !== undefined;

  const onImageLightboxClose = () => {
    resetSelectedResource();
  };

  const handleVisualElementChange = visualElement => {
    onChange({
      target: {
        name,
        value: visualElement,
      },
    });
    resetSelectedResource();
  };

  if (!selectedResource) {
    return null;
  }
  return (
    <VisualElementModalWrapper resource={selectedResource} isOpen onClose={onImageLightboxClose}>
      {setH5pFetchFail => (
        <VisualElementSearch
          selectedResource={selectedResource}
          handleVisualElementChange={handleVisualElementChange}
          closeModal={onImageLightboxClose}
          videoTypes={videoTypes}
          articleLanguage={articleLanguage}
          setH5pFetchFail={setH5pFetchFail}
          showMetaImageCheckbox={showMetaImageCheckbox}
          onSaveAsMetaImage={image => onSaveAsMetaImage(image, formikContext)}
        />
      )}
    </VisualElementModalWrapper>
  );
};

VisualElementSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedResource: PropTypes.string,
  resetSelectedResource: PropTypes.func.isRequired,
  videoTypes: PropTypes.array,
  articleLanguage: PropTypes.string.isRequired,
};

export default VisualElementSelectField;
