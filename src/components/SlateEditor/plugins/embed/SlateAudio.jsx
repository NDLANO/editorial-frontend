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

  componentWillMount() {
    this.loadAudio();
  }

  loadAudio() {
    visualElementApi
      .fetchAudio(this.props.embed.resource_id)
      .then(audio => {
        this.setState({
          audio,
        });
      })
      .catch(err => {
        visualElementApi.onError(err);
      });
  }

  render() {
    const { embed, figureClass, attributes } = this.props;
    const { audio } = this.state;
    return (
      <figure className="article_audio" {...attributes}>
        <audio controls {...figureClass}>
          {audio && audio.audioFile.url ? (
            <source src={audio.audioFile.url} type={audio.audioFile.mimeType} />
          ) : (
            undefined
          )}
          <track kind="captions" label={embed.title} />
        </audio>
        <figcaption>{audio && audio.title.title}</figcaption>
      </figure>
    );
  }
}

SlateAudio.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
};

export default injectT(SlateAudio);
