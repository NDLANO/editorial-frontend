/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import SlateInputField from './SlateInputField';
import { EmbedShape } from '../../../../shapes';

class SlateAudio extends React.Component {
  constructor() {
    super();
    this.loadAudio = this.loadAudio.bind(this);
    this.state = {
      audioSource: '',
      audioType: '',
    };
  }

  loadAudio() {
    visualElementApi
      .fetchAudio(this.props.embed.resource_id)
      .then(result => {
        this.setState({
          audioSource: result.audioFile.url,
          audioType: result.audioFile.mimeType,
        });
      })
      .catch(err => {
        visualElementApi.onError(err);
      });
  }

  render() {
    const {
      t,
      embed,
      figureClass,
      attributes,
      submitted,
      onFigureInputChange,
    } = this.props;
    const { audioSource, audioType } = this.state;
    return (
      <div {...attributes}>
        <audio
          controls
          autoPlay
          onPlay={!audioSource && this.loadAudio}
          {...figureClass}>
          {audioSource
            ? <source src={audioSource} type={audioType} />
            : undefined}
          <track kind="captions" label={embed.caption} />
        </audio>
        <SlateInputField
          name="caption"
          label={t('form.audio.caption.label')}
          type="text"
          required
          value={embed.caption}
          submitted={submitted}
          onChange={onFigureInputChange}
          placeholder={t('form.audio.caption.placeholder')}
        />
      </div>
    );
  }
}

SlateAudio.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

export default injectT(SlateAudio);
