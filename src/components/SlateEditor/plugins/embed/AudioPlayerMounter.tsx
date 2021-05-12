/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { Remarkable } from 'remarkable';
import { injectT, tType } from '@ndla/i18n';
import { AudioPlayer, initAudioPlayers } from '@ndla/ui';
// @ts-ignore
import { FigureCaption, FigureLicenseDialog } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { SlateAudio, LocaleType } from '../../../../interfaces';

interface Props {
  audio: SlateAudio;
  locale: LocaleType;
  speech: boolean;
}

const AudioPlayerMounter = ({ t, audio, locale, speech }: Props & tType) => {
  const { caption, copyright, podcastMeta } = audio;

  useEffect(() => {
    initAudioPlayers(locale);
  }, [locale]);

  const renderMarkdown = (text: string) => {
    const md = new Remarkable();
    const rendered = md.render(text);
    return <span dangerouslySetInnerHTML={{ __html: rendered }}></span>;
  };

  const license = getLicenseByAbbreviation(copyright.license?.license || '', locale);
  const figureLicenseDialogId = `edit-audio-${audio.id}`;

  const messages = {
    title: t('dialog.title'),
    close: t('dialog.close'),
    rulesForUse: t('dialog.audio.rulesForUse'),
    learnAboutLicenses: t('dialog.learnAboutLicenses'),
    source: t('dialog.source'),
  };

  const podcastImg = podcastMeta?.coverPhoto && {
    url: `${podcastMeta.coverPhoto.url}?width=200&height=200`,
    alt: podcastMeta.coverPhoto.altText,
  };
  const description = podcastMeta?.introduction && renderMarkdown(podcastMeta.introduction);
  const textVersion = podcastMeta?.manuscript && renderMarkdown(podcastMeta.manuscript);

  return (
    <div>
      <AudioPlayer
        src={audio.audioFile.url}
        title={audio.title}
        speech={speech}
        img={podcastMeta?.coverPhoto && podcastImg}
        // @ts-ignore
        description={description}
        textVersion={textVersion}
      />
      {!speech && (
        <>
          <FigureCaption
            id={figureLicenseDialogId}
            figureId={`figure-${audio.id}`}
            caption={caption}
            reuseLabel=""
            licenseRights={license.rights}
            authors={copyright.creators}
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
