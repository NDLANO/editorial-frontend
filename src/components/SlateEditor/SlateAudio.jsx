/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as visualElementApi from '../../containers/VisualElement/visualElementApi';

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
      .fetchAudio(this.props.embedTag.id)
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
    const { embedTag, figureClass, attributes } = this.props;

    if (!embedTag || !embedTag.id) {
      return null;
    }

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
          <track kind="captions" label={embedTag.caption} />
        </audio>
      </div>
    );
  }
}

SlateAudio.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  figureClass: PropTypes.object.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
};

SlateAudio.defaultProps = {
  embedTag: {
    caption: '',
  },
};

export default SlateAudio;
