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

const SlateVideo = ({
  embedTag,
  figureClass,
  onFigureInputChange,
  attributes,
  t,
}) => {
  if (!embedTag || !embedTag.id) {
    return null;
  }

  const src = `//players.brightcove.net/${window.config
    .brightCoveAccountId}/${window.config
    .brightcovePlayerId}_default/index.min.js`;
  return (
    <div {...attributes}>
      <figure className={figureClass}>
        <Helmet>
          <script src={src} type="text/javascript" />
        </Helmet>
        <video
          data-video-id={embedTag.id}
          data-account={window.config.brightCoveAccountId}
          data-player={window.config.brightcovePlayerId}
          data-embed="default"
          className="video-js"
          controls
          alt={embedTag.alt}>
          <track kind="captions" label={embedTag.caption} />
        </video>
      </figure>
      <SlateInputField
        name="caption"
        label={t(
          'learningResourceForm.fields.content.figure.caption.brightcove',
        )}
        type="text"
        value={embedTag.caption}
        onChange={onFigureInputChange}
        placeholder={t(
          'learningResourceForm.fields.content.figure.caption.brightcove',
        )}
      />
    </div>
  );
};

SlateVideo.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default injectT(SlateVideo);
