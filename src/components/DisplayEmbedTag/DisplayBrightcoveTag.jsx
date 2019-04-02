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
import { css } from '@emotion/core';
import config from '../../config';
import DeleteButton from '../DeleteButton';

const removeButtonStyle = css`
  right: -2rem;
`;

const DisplayBrightcoveTag = ({ embedTag, className, onRemoveClick }) => {
  const src = `//players.brightcove.net/${config.brightCoveAccountId}/${
    config.brightcovePlayerId
  }_default/index.min.js`;
  return (
    <figure className={className}>
      <Helmet>
        <script src={src} type="text/javascript" />
      </Helmet>
      <video
        data-video-id={embedTag.videoid}
        data-account={config.brightCoveAccountId}
        data-player={config.brightcovePlayerId}
        data-embed="default"
        className="video-js"
        controls
        alt={embedTag.alt}>
        <track kind="captions" label={embedTag.caption} />
      </video>
      <figcaption>{embedTag.caption}</figcaption>
      <DeleteButton
        stripped
        onClick={onRemoveClick}
        style={removeButtonStyle}
      />
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
  onRemoveClick: PropTypes.object,
};

export default DisplayBrightcoveTag;
