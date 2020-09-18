/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import { initAudioPlayers } from '@ndla/article-scripts';
// @ts-ignore
import { AudioPlayer, FigureCaption, FigureLicenseDialog } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { Audio, TranslateType } from '../../../../interfaces';

interface Props {
  t: TranslateType;
  audio: Audio;
  locale: string;
  speech: boolean;
}

const AudioPlayerMounter: React.FC<Props> = ({ t, audio, locale, speech }) => {
  useEffect(() => {
    initAudioPlayers();
  }, []);

  const license = getLicenseByAbbreviation(
    audio.copyright.license.license,
    locale,
  );
  const figureLicenseDialogId = `edit-audio-${audio.id}`;

  const messages = {
    title: t('dialog.title'),
    close: t('dialog.close'),
    rulesForUse: t('dialog.audio.rulesForUse'),
    learnAboutLicenses: t('dialog.learnAboutLicenses'),
    source: t('dialog.source'),
  };

  return (
    <div>
      <AudioPlayer
        type={audio.audioFile.mimeType}
        src={audio.audioFile.url}
        title={audio.title}
        speech={speech}
      />
      {!speech && (
        <>
          <FigureCaption
            id={figureLicenseDialogId}
            figureId={`figure-${audio.id}`}
            caption={audio.caption}
            reuseLabel=""
            licenseRights={license.rights}
            authors={audio.copyright.creators}
          />
          <FigureLicenseDialog
            id={figureLicenseDialogId}
            title={audio.title}
            license={license}
            authors={[]}
            origin={origin}
            messages={messages}
            locale={locale}
          />
        </>
      )}
    </div>
  );
};

export default injectT(AudioPlayerMounter);
