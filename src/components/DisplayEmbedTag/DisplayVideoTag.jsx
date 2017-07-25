/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import config from '../../config';

const DisplayImageTag = ({ embedTag, className }) => {
  if (!embedTag || !embedTag.id) {
    return null;
  }
  const src = `//players.brightcove.net/${config.brightcoveAccountId}/${config.brightcovePlayerId}_default/index.min.js`;
  return (
    <figure className={className}>
      <Helmet>
        <script src={src} type="text/javascript" />
      </Helmet>
      <video
        data-video-id={embedTag.id}
        data-account={config.brightCoveAccountId}
        data-player={config.brightcovePlayerId}
        data-embed="default"
        className="video-js"
        controls
        alt={embedTag.alt}>
        <track kind="captions" label={embedTag.caption} />
      </video>
      <figcaption>
        {embedTag.caption}
      </figcaption>
    </figure>
  );
};

DisplayImageTag.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

export default DisplayImageTag;
