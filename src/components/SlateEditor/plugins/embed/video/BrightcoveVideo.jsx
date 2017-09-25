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
import { Figure } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import SlateInputField from '../SlateInputField';
import { EmbedShape } from '../../../../../shapes';

const BrightcoveVideo = ({
  embed,
  onFigureInputChange,
  attributes,
  submitted,
  t,
}) => {
  const src = `//players.brightcove.net/${window.config
    .brightCoveAccountId}/${window.config
    .brightcovePlayerId}_default/index.min.js`;
  return (
    <Figure {...attributes}>
      <Helmet>
        <script src={src} type="text/javascript" />
      </Helmet>
      <div
        style={{
          display: 'block',
          position: 'relative',
          maxWidth: '100%',
        }}>
        <div style={{ paddingTop: '56.25%' }}>
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
            data-video-id={embed.videoid}
            data-account={embed.account}
            data-player={embed.player}
            data-embed="default"
            className="video-js"
            controls>
            <track kind="captions" label={embed.caption} />
          </video>
        </div>
      </div>
      <SlateInputField
        name="caption"
        label={t('form.video.caption.label')}
        type="text"
        required
        value={embed.caption}
        submitted={submitted}
        onChange={onFigureInputChange}
        placeholder={t('form.video.caption.placeholder')}
      />
    </Figure>
  );
};

BrightcoveVideo.propTypes = {
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

export default injectT(BrightcoveVideo);
