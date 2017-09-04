/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EmbedShape } from '../../shapes';
import ImageFocalPointEdit from './ImageFocalPointEdit';
import ImageCropEdit from './ImageCropEdit';

const ImageTransformEditor = ({
  embed,
  editType,
  onFocalPointChange,
  onCropChange,
}) => {
  const focalPoint = { x: embed.focalX, y: embed.focalY };
  const cropString = `cropStartX=${embed['upper-left-x']}&cropStartY=${embed['upper-left-y']}&cropEndX=${embed['lower-right-x']}&cropEndY=${embed['lower-right-y']}`;
  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}?${cropString}`;
  switch (editType) {
    case 'focalPoint':
      return (
        <ImageFocalPointEdit
          embed={embed}
          focalPoint={focalPoint}
          onFocalPointChange={onFocalPointChange}
          src={src}
        />
      );
    case 'crop':
      return <ImageCropEdit embed={embed} onCropChange={onCropChange} />;
    default:
      return (
        <figure>
          <img src={src} alt={embed.alt} />
        </figure>
      );
  }
};

ImageTransformEditor.propTypes = {
  embed: EmbedShape.isRequired,
  editType: PropTypes.string,
  onFocalPointChange: PropTypes.func.isRequired,
  onCropChange: PropTypes.func.isRequired,
};

export default ImageTransformEditor;
