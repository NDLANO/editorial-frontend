/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import config from '../../config';
import { EmbedShape } from '../../shapes';

const ImageCropEdit = ({ embed, onCropComplete, transformData }) => {
  const embedHasCrop =
    transformData['upper-left-x'] &&
    transformData['upper-left-y'] &&
    transformData['lower-right-x'] &&
    transformData['lower-right-y'];

  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
  const [crop, setCrop] = useState(
    embedHasCrop
      ? {
          x: parseInt(transformData['upper-left-x']),
          y: parseInt(transformData['upper-left-y']),
          width:
            parseInt(transformData['lower-right-x']) -
            parseInt(transformData['upper-left-x']),
          height:
            parseInt(transformData['lower-right-y']) -
            parseInt(transformData['upper-left-y']),
        }
      : undefined,
  );

  return (
    <ReactCrop
      src={src}
      onComplete={onCropComplete}
      crop={crop}
      onChange={crop => setCrop(crop)}
    />
  );
};

ImageCropEdit.propTypes = {
  embed: EmbedShape.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  transformData: PropTypes.shape({
    'upper-left-x': PropTypes.string,
    'upper-left-y': PropTypes.string,
    'lower-right-x': PropTypes.string,
    'lower-right-y': PropTypes.string,
    'focal-x': PropTypes.string,
    'focal-y': PropTypes.string,
  }),
};

export default ImageCropEdit;
