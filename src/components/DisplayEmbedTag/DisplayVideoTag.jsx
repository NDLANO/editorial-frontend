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
      <video
         style={{
           width: '100%',
           height: '100%',
           position: 'absolute',
           top: '0px',
           bottom: '0px',
           right: '0px',
           left: '0px',
         }}
         data-video-id={videoid}
         data-account={account}
         data-player={player}
         data-embed="default"
         className="video-js"
         controls
         alt={embedTag.alt}
       />
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
