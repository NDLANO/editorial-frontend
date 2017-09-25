/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Figure } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import SlateInputField from '../SlateInputField';
import { EmbedShape } from '../../../../../shapes';

const YouTubeVideo = ({
  embed,
  onFigureInputChange,
  attributes,
  submitted,
  t,
}) =>
  <Figure {...attributes}>
    <div
      style={{
        display: 'block',
        position: 'relative',
        maxWidth: '100%',
      }}>
      <iframe
        style={{ border: 'none', minHeight: '437px' }}
        title={embed.metaData.title}
        src={embed.metaData.pagemap.videoobject[0].embedurl}
        allowFullScreen
      />
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
  </Figure>;
YouTubeVideo.propTypes = {
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

export default injectT(YouTubeVideo);
