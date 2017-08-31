/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const DisplayImageTag = ({ embedTag, className }) => {
  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embedTag.resource_id}`;
  return (
    <figure className={className}>
      <img src={src} alt={embedTag.alt} />
      <figcaption>
        {embedTag.caption}
      </figcaption>
    </figure>
  );
};

DisplayImageTag.propTypes = {
  embedTag: PropTypes.shape({
    resource_id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    caption: PropTypes.string,
    alt: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default DisplayImageTag;
