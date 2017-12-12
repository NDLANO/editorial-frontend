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

const DisplayBrightcoveTag = ({ embedTag, className }) => {
  const src = `//players.brightcove.net/${window.config.brightCoveAccountId}/${
    window.config.brightcovePlayerId
  }_default/index.min.js`;
  return (
    <figure className={className}>
      <Helmet>
        <script src={src} type="text/javascript" />
      </Helmet>
      <video
        data-video-id={embedTag.videoid}
        data-account={window.config.brightCoveAccountId}
        data-player={window.config.brightcovePlayerId}
        data-embed="default"
        className="video-js"
        controls
        alt={embedTag.alt}>
        <track kind="captions" label={embedTag.caption} />
      </video>
      <figcaption>{embedTag.caption}</figcaption>
    </figure>
  );
};

DisplayBrightcoveTag.propTypes = {
  embedTag: PropTypes.shape({
    resource: PropTypes.string.isRequired,
    videoid: PropTypes.string.isRequired,
    caption: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default DisplayBrightcoveTag;
