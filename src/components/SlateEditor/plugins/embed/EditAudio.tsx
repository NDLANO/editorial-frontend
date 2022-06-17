/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, FormEvent, MouseEvent, createRef } from 'react';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { AudioPlayer } from '@ndla/ui';
import ObjectSelector from '../../../ObjectSelector';
import Overlay from '../../../Overlay';
import { Portal } from '../../../Portal';
import FigureButtons from './FigureButtons';
import { SlateAudio, AudioEmbed } from '../../../../interfaces';

const placeholderStyle = css`
  position: relative;
  border: 1px solid var(--article-color);
`;

interface Props {
  audio: SlateAudio;
  changes: { [x: string]: string };
  embed: AudioEmbed;
  language: string;
  onAudioFigureInputChange: (event: FormEvent<HTMLSelectElement>) => void;
  onChange: (event: FormEvent<HTMLSelectElement>) => void;
  onExit: (event: MouseEvent) => void;
  onRemoveClick: (event: MouseEvent) => void;
  speech: boolean;
  type: string;
}

const EditAudio = ({
  embed,
  onChange,
  onAudioFigureInputChange,
  onExit,
  onRemoveClick,
  type,
  language,
  speech,
  audio,
  changes,
}: Props) => {
  const { t } = useTranslation();
  let placeholderElement: any = createRef();
  let embedElement: any = createRef();

  useEffect(() => {
    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedElement.getBoundingClientRect();
    const placeholderRect = placeholderElement.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderElement.style.height = `${embedRect.height + 120}px`;
    embedElement.style.position = 'absolute';
    embedElement.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedElement.style.left = `${placeholderRect.left}px`;
    embedElement.style.width = `${placeholderRect.width}px`;
  }, [embedElement, placeholderElement]);

  return (
    <>
      <Overlay onExit={onExit} key="audioOverlay" />
      <div
        key="audioPlaceholder"
        css={placeholderStyle}
        ref={placeholderEl => {
          placeholderElement = placeholderEl;
        }}
      />
      <Portal isOpened key="audioPortal">
        <div
          css={css`
            z-index: 1;
            padding: 50px;
            background-color: white;
          `}
          ref={embedEl => {
            embedElement = embedEl;
          }}>
          <ObjectSelector
            onClick={(evt: MouseEvent) => evt.stopPropagation()}
            onChange={onChange}
            onBlur={onChange}
            key="type"
            name="type"
            labelKey="label"
            idKey="id"
            value={type}
            options={[
              {
                id: 'standard',
                label: t('form.audio.sound'),
              },
              {
                id: 'minimal',
                label: t('form.audio.speech'),
              },
            ]}
          />
          <AudioPlayer src={audio.audioFile.url} title={audio.title} speech={speech} />
          <FigureButtons
            figureType="audio"
            tooltip={t('form.audio.remove')}
            onRemoveClick={onRemoveClick}
            embed={embed}
            language={language}
            withMargin
          />
        </div>
      </Portal>
    </>
  );
};

export default EditAudio;
