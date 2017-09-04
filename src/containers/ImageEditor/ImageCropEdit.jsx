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

const ImageCropEdit = ({ embed, onCropChange }) => {
  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;

  const embedHasCrop =
    embed['upper-left-x'] &&
    embed['upper-left-y'] &&
    embed['lower-right-x'] &&
    embed['lower-right-y'];
  const crop = embedHasCrop
    ? {
        x: embed['upper-left-x'],
        y: embed['upper-left-y'],
        width: embed['lower-right-x'] - embed['upper-left-x'],
        height: embed['lower-right-y'] - embed['upper-left-y'],
      }
    : undefined;
  return <ReactCrop src={src} onChange={onCropChange} crop={crop} />;
};

ImageCropEdit.propTypes = {
  embed: EmbedShape.isRequired,
  onCropChange: PropTypes.func.isRequired,
};

export default ImageCropEdit;
