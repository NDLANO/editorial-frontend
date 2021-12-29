/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { RenderElementProps } from 'slate-react';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { fetchAudio } from '../../../../modules/audio/audioApi';
import { onError } from '../../../../util/resolveJsonOrRejectWithError';
import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, LocaleType, AudioEmbed } from '../../../../interfaces';

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: AudioEmbed;
  language: string;
  locale: LocaleType;
  onRemoveClick: (event: MouseEvent) => void;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

const SlatePodcast = ({
  attributes,
  embed,
  language,
  locale,
  onRemoveClick,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [audio, setAudio] = useState<Audio>({} as Audio);
  const showCopyOutline = isSelectedForCopy;

  useEffect(() => {
    const getAudio = async () => {
      try {
        const audio = await fetchAudio(parseInt(embed.resource_id), language);
        setAudio({
          ...audio,
          caption: embed.caption,
          title: audio.title?.title || '',
        });
      } catch (error) {
        onError(error);
      }
    };

    getAudio();
  }, [embed, language]);

  return (
    <div draggable {...attributes}>
      <Figure id={`${audio.id}`}>
        <FigureButtons
          figureType="podcast"
          tooltip={t('form.podcast.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          language={language}
        />
        <div
          contentEditable={false}
          css={
            showCopyOutline && {
              boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
            }
          }>
          {audio.id && <AudioPlayerMounter audio={audio} locale={locale} speech={false} />}
        </div>
      </Figure>
      {children}
    </div>
  );
};

export default SlatePodcast;
