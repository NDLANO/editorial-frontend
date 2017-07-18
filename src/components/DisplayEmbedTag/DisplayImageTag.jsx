/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';

const DisplayImageTag = ({embedTag, className}) => {
  if (!embedTag || !embedTag.id) {
    return null;
  }
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
  return (
    <figure className={className}>
      <img src={src} alt={embedTag.alt} />
      <figcaption>{embedTag.caption}</figcaption>
    </figure>
  );
}

DisplayImageTag.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
}

export default DisplayImageTag;
