/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SlateInputField from './SlateInputField';

const SlateImage = props => {
  const { embedTag, className, attributes, onFigureInputChange } = props;

  if (!embedTag || !embedTag.id) {
    return null;
  }

  const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;

  return (
    <div {...attributes}>
      <figure className={className}>
        <img src={src} alt={embedTag.alt} />
      </figure>
      <SlateInputField
        name="caption"
        label="caption"
        type="text"
        value={embedTag.caption}
        onChange={onFigureInputChange}
        placeholder="caption"
      />
      <SlateInputField
        name="alt"
        label="alt"
        type="text"
        value={embedTag.alt}
        onChange={onFigureInputChange}
        placeholder="alt-text"
      />
    </div>
  );
};

SlateImage.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default SlateImage;
