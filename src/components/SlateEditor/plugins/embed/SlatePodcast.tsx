/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { RenderElementProps } from 'slate-react';
// @ts-ignore
import { Figure } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';

import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

import AudioPlayerMounter from './AudioPlayerMounter';
import FigureButtons from './FigureButtons';
import { SlateAudio as Audio, Embed, LocaleType } from '../../../../interfaces';

interface BaseProps {
  attributes: RenderElementProps['attributes'];
  embed: Embed;
  language: string;
  locale: LocaleType;
  onRemoveClick: Function;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

type Props = BaseProps & tType;

const SlatePodcast = ({
  t,
  attributes,
  embed,
  language,
  locale,
  onRemoveClick,
  active,
  isSelectedForCopy,
  children,
}: Props) => {
  const [audio, setAudio] = useState<Audio>({} as Audio);
  const showCopyOutline = isSelectedForCopy;

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

export default injectT(SlatePodcast);
