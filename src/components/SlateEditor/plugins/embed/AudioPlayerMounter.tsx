/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import css from '@emotion/css';
import { AudioPlayer } from '@ndla/ui';
// @ts-ignore
import { FigureCaption, FigureLicenseDialog } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { SlateAudio, LocaleType } from '../../../../interfaces';

interface Props {
  audio: SlateAudio;
  locale: LocaleType;
  speech: boolean;
}

const AudioPlayerMounter = ({ audio, locale, speech }: Props) => {
  const { t } = useTranslation();
  const { copyright, podcastMeta } = audio;

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

  return (
    <div
      css={css`
        p {
          margin: 0 !important;
        }
        ul {
          margin-top: 0;
        }
      `}>
      <AudioPlayer
        src={audio.audioFile.url}
        title={audio.title}
        speech={speech}
        img={podcastImg}
        description={podcastMeta?.introduction}
        textVersion={audio?.manuscript}
      />
      {!speech && (
        <FigureCaption
          id={figureLicenseDialogId}
          figureId={`figure-${audio.id}`}
          caption={audio.caption}
          reuseLabel={t('audio.reuse')}
          licenseRights={license.rights}
          authors={copyright.creators}>
          <FigureLicenseDialog
            id={figureLicenseDialogId}
            title={audio.title}
            license={license}
            authors={[]}
            origin={origin}
            messages={messages}
            locale={locale}
          />
        </FigureCaption>
      )}
    </div>
  );
};

export default AudioPlayerMounter;
