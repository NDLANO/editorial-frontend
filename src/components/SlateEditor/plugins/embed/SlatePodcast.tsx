/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';

import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { Audio, Embed, LocaleType } from '../../../../interfaces';

interface BaseProps {
  attributes?: {
    'data-key': String;
    'data-slate-object': String;
  };
  embed: Embed;
  language: string;
  locale: LocaleType;
  onRemoveClick: Function;
}

type Props = BaseProps & tType;

const SlatePodcast = ({ t, attributes, embed, language, locale, onRemoveClick }: Props) => {
  const [audio, setAudio] = useState<Audio>({} as Audio);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const audio = await visualElementApi.fetchAudio(embed.resource_id, language);
        setAudio({
          ...audio,
          caption: embed.caption,
          title: audio.title?.title || '',
        });
      } catch (error) {
        visualElementApi.onError(error);
      }
    };

    getAudio();
  }, [embed, language]);

  return (
    <div draggable {...attributes}>
      <Figure id={`${audio.id}`}>
        <FigureButtons
          tooltip={t('form.audio.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="audio"
          language={language}
        />
        {audio.id && <AudioPlayerMounter audio={audio} locale={locale} speech={false} />}
      </Figure>
    </div>
  );
};

export default injectT(SlatePodcast);
