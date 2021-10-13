/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import css from '@emotion/css';
import { AudioPlayer } from '@ndla/ui';
// @ts-ignore
import { FigureCaption } from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { SlateAudio, LocaleType } from '../../../../interfaces';
import { ImageApiType } from '../../../../modules/image/imageApiInterfaces';
import { fetchImage } from '../../../../modules/image/imageApi';

interface Props {
  audio: SlateAudio;
  locale: LocaleType;
  speech: boolean;
}

const ImageLicense = ({ image, locale }: { locale: LocaleType; image: ImageApiType }) => {
  const { t } = useTranslation();
  const { copyright, id } = image;
  const {
    license: { license: licenseAbbreviation },
  } = copyright;
  const license = getLicenseByAbbreviation(licenseAbbreviation, locale);

  return (
    <>
      <FigureCaption
        figureId={`figure-${id}`}
        id={`${id}`}
        reuseLabel={t('image.reuse')}
        licenseRights={license.rights}
        authors={copyright.creators || copyright.rightsholders || copyright.processors}
        locale={locale}></FigureCaption>
    </>
  );
};

const AudioPlayerMounter = ({ audio, locale, speech }: Props) => {
  const { t } = useTranslation();
  const { copyright, podcastMeta } = audio;
  const [image, setImage] = useState<ImageApiType>();

  const license = getLicenseByAbbreviation(copyright.license?.license || '', locale);
  const figureLicenseDialogId = `edit-audio-${audio.id}`;

  const podcastImg = podcastMeta?.coverPhoto && {
    url: `${podcastMeta.coverPhoto.url}?width=200&height=200`,
    alt: podcastMeta.coverPhoto.altText,
  };

  useEffect(() => {
    if (podcastMeta?.coverPhoto.id) {
      fetchImage(parseInt(podcastMeta?.coverPhoto.id), locale).then(res => {
        setImage(res);
      });
    }
  }, [podcastMeta?.coverPhoto.id, locale]);

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
        <>
          <FigureCaption
            id={figureLicenseDialogId}
            figureId={`figure-${audio.id}`}
            reuseLabel={t('audio.reuse')}
            licenseRights={license.rights}
            authors={copyright.creators}
          />
        </>
      )}
      {image && <ImageLicense image={image} locale={locale} />}
    </div>
  );
};

export default AudioPlayerMounter;
