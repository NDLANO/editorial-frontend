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
import { injectT } from 'ndla-i18n';
import SlateInputField from './SlateInputField';
import ForbiddenOverlay from '../ForbiddenOverlay';
import { EmbedShape } from '../../shapes';

const SlateVideo = ({
  embed,
  figureClass,
  onFigureInputChange,
  attributes,
  deletedOnSave,
  submitted,
  t,
}) => {
  const src = `//players.brightcove.net/${window.config
    .brightCoveAccountId}/${window.config
    .brightcovePlayerId}_default/index.min.js`;
  return (
    <div {...attributes}>
      <figure {...figureClass}>
        <Helmet>
          <script src={src} type="text/javascript" />
        </Helmet>
        <video
          data-video-id={embed.videoid}
          data-account={embed.account}
          data-player={embed.player}
          data-embed="default"
          className="video-js"
          controls
          alt={embed.alt}>
          <track kind="captions" label={embed.caption} />
        </video>
        {deletedOnSave &&
          <ForbiddenOverlay
            text={t('topicArticleForm.fields.content.deleteEmbedOnSave')}
          />}
      </figure>
      <SlateInputField
        name="caption"
        label={t('form.video.caption.label')}
        type="text"
        required
        value={embed.caption}
        submitted={submitted}
        onChange={onFigureInputChange}
        placeholder={t('form.video.caption.placeholder')}
        deletedOnSave={deletedOnSave}
      />
    </div>
  );
};

SlateVideo.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export default injectT(SlateVideo);
