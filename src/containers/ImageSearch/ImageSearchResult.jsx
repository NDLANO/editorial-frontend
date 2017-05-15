/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import classNames from 'classnames';
// import PreviewImage from './PreviewImage';
import { scaleImage } from './imageScaler';

export default function ImageSearchResult({ image, onImageClick, selectedImage, onSelectImage }) {
  const activeClassName = () => classNames({
    'image_list-item': true,
    'image_list-item--active': selectedImage.id === image.id,
  });

  return (
    <div key={image.id} className={activeClassName()}>
      <div className="image_list-item-inner">
        <Button stripped onClick={evt => onImageClick(evt, image)}>
          <img role="presentation" alt="presentation" src={scaleImage(image.previewUrl)} />
        </Button>
      </div>
      <Button onClick={evt => onSelectImage(evt, selectedImage)}>Velg bilde</Button>
      {/* {selectedImage.id === image.id ? <PreviewImage image={selectedImage} onSaveImage={evt => onSaveImage(evt, selectedImage)} /> : ''}*/}
    </div>
  );
}

ImageSearchResult.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
  }),
  onImageClick: PropTypes.func.isRequired,
  selectedImage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
  }),
  onSelectImage: PropTypes.func.isRequired,
};
