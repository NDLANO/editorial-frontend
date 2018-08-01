import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { initAudioPlayers } from 'ndla-article-scripts';
import { AudioPlayer, FigureCaption } from 'ndla-ui';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { AudioShape } from '../../../../shapes';

class AudioPlayerMounter extends Component {
  componentDidMount() {
    initAudioPlayers();
  }

  render() {
    const {
      id,
      title,
      caption,
      audioFile: { mimeType, url },
      copyright: {
        creators,
        license: { license: licenseAbbreviation },
      },
    } = this.props.audio;
    const locale = 'nb';
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

    return (
      <div>
        <AudioPlayer
          type={mimeType}
          src={url}
          title={title}
          speech={this.props.speech}
        />
        {!this.props.speech && (
          <FigureCaption
            id={`${id}`}
            figureId={`figure-${id}`}
            caption={caption}
            reuseLabel=""
            licenseRights={license.rights}
            authors={creators}
          />
        )}
      </div>
    );
  }
}

AudioPlayerMounter.propTypes = {
  audio: AudioShape,
  title: PropTypes.string,
  caption: PropTypes.string,
  speech: PropTypes.bool,
};

export default AudioPlayerMounter;
