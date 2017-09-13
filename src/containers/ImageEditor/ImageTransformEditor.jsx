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
import { getSrcSets } from '../../util/imageEditorUtil';

const ImageTransformEditor = ({
  embed,
  editType,
  onFocalPointChange,
  onCropComplete,
  transformData,
}) => {
  const cropString = `cropStartX=${transformData[
    'upper-left-x'
  ]}&cropStartY=${transformData['upper-left-y']}&cropEndX=${transformData[
    'lower-right-x'
  ]}&cropEndY=${transformData['lower-right-y']}`;

  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}?${cropString}`;
  switch (editType) {
    case 'focalPoint':
      return (
        <ImageFocalPointEdit
          embed={embed}
          transformData={transformData}
          onFocalPointChange={onFocalPointChange}
          src={src}
        />
      );
    case 'crop':
      return (
        <ImageCropEdit
          embed={embed}
          onCropComplete={onCropComplete}
          transformData={transformData}
        />
      );
    default:
      return (
        <figure>
          <img
            alt={embed.alt}
            srcSet={getSrcSets(embed.resource_id, transformData)}
          />
        </figure>
      );
  }
};

ImageTransformEditor.propTypes = {
  embed: EmbedShape.isRequired,
  editType: PropTypes.string,
  onFocalPointChange: PropTypes.func.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  transformData: PropTypes.shape({
    'upper-left-x': PropTypes.number,
    'upper-left-y': PropTypes.number,
    'lower-right-x': PropTypes.number,
    'lower-right-y': PropTypes.number,
    'focal-x': PropTypes.number,
    'focal-y': PropTypes.number,
  }),
};

export default ImageTransformEditor;
