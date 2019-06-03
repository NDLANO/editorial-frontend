import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { initAudioPlayers } from '@ndla/article-scripts';
import { AudioPlayer, FigureCaption, FigureLicenseDialog } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { AudioShape } from '../../../../shapes';

class AudioPlayerMounter extends Component {
  componentDidMount() {
    initAudioPlayers();
  }

  render() {
    const {
      audio: {
        id,
        title,
        caption,
        audioFile: { mimeType, url },
        copyright: {
          creators,
          license: { license: licenseAbbreviation },
        },
      },
      t,
      speech,
    } = this.props;
    const locale = 'nb';
    const license = getLicenseByAbbreviation(licenseAbbreviation, locale);
    const figureLicenseDialogId = `edit-audio-${id}`;

    const messages = {
      title: t('dialog.title'),
      close: t('dialog.close'),
      rulesForUse: t('dialog.audio.rulesForUse'),
      learnAboutLicenses: t('dialog.learnAboutLicenses'),
      source: t('dialog.source'),
    };

    return (
      <div>
        <AudioPlayer type={mimeType} src={url} title={title} speech={speech} />
        {!speech && (
          <Fragment>
            <FigureCaption
              id={figureLicenseDialogId}
              figureId={`figure-${id}`}
              caption={caption}
              reuseLabel=""
              licenseRights={license.rights}
              authors={creators}
            />
            <FigureLicenseDialog
              id={figureLicenseDialogId}
              title={title}
              license={license}
              authors={[]}
              origin={origin}
              messages={messages}
            />
          </Fragment>
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

export default injectT(AudioPlayerMounter);
