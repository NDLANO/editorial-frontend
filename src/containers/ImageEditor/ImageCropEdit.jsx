/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import { EmbedShape } from '../../shapes';

const ImageCropEdit = ({ embed, onCropComplete, transformData }) => {
  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;

  const embedHasCrop =
    transformData['upper-left-x'] &&
    transformData['upper-left-y'] &&
    transformData['lower-right-x'] &&
    transformData['lower-right-y'];
  const crop = embedHasCrop
    ? {
        x: transformData['upper-left-x'],
        y: transformData['upper-left-y'],
        width: transformData['lower-right-x'] - transformData['upper-left-x'],
        height: transformData['lower-right-y'] - transformData['upper-left-y'],
      }
    : undefined;
  return <ReactCrop src={src} onComplete={onCropComplete} crop={crop} />;
};

ImageCropEdit.propTypes = {
  embed: EmbedShape.isRequired,
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

export default ImageCropEdit;
