/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImageFocalPointEdit from './ImageFocalPointEdit';

const ImageEdit = ({ embedTag, editType, focalPoint, onFocalPointChange }) => {
  const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
  switch (editType) {
    case 'focalPoint':
      return (
        <ImageFocalPointEdit
          embedTag={embedTag}
          focalPoint={focalPoint}
          onFocalPointChange={onFocalPointChange}
        />
      );
    default:
      return (
        <figure>
          <img src={src} alt={embedTag.alt} />
        </figure>
      );
  }
};

ImageEdit.propTypes = {
  embedTag: PropTypes.shape({
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  editType: PropTypes.string.isRequired,
  focalPoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onFocalPointChange: PropTypes.func.isRequired,
};

ImageEdit.defaultProps = {
  editType: '',
};

export default ImageEdit;
