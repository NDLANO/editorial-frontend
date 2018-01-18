import React, { Component } from 'react';
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
      title: { title },
      audioFile: { mimeType, url },
      copyright: { creators, license: { license: licenseAbbreviation } },
    } = this.props.audio;
    const locale = 'nb';
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);
    return (
      <div>
        <AudioPlayer type={mimeType} src={url} title={title} />
        <FigureCaption
          id={`${id}`}
          caption={title}
          reuseLabel={''}
          licenseRights={license.rights}
          authors={creators}
        />
      </div>
    );
  }
}

AudioPlayerMounter.propTypes = {
  audio: AudioShape,
};

export default AudioPlayerMounter;
