/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useEffect, Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import { AudioPlayer, initAudioPlayers } from '@ndla/ui';
import ObjectSelector from '../../../ObjectSelector';
import Overlay from '../../../Overlay';
import { Portal } from '../../../Portal';
import { useSlateContext } from '../../SlateContext';
import FigureButtons from './FigureButtons';
import { Audio, Embed, LocaleType } from '../../../../interfaces';

const placeholderStyle = css`
  position: relative;
  border: 1px solid var(--article-color);
`;

interface Props {
  audio: Audio;
  changes: { [x: string]: string };
  embed: Embed;
  language: string;
  locale: LocaleType;
  onAudioFigureInputChange: Function;
  onChange: Function;
  onExit: Function;
  onRemoveClick: Function;
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
  t,
  language,
  locale,
  speech,
  audio,
  changes,
}: Props & tType) => {
  let placeholderElement: any = React.createRef();
  let embedElement: any = React.createRef();
  const { submitted } = useSlateContext();

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
    initAudioPlayers(locale);
  }, [embedElement, locale, placeholderElement]);

  return (
    <Fragment>
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
          <Input
            name="caption"
            label={t('form.audio.caption.label')}
            container="div"
            type="text"
            value={changes?.caption || embed?.caption}
            onChange={onAudioFigureInputChange}
            placeholder={t('form.audio.caption.placeholder')}
            submitted={submitted}
          />
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
    </Fragment>
  );
};

export default injectT(EditAudio);
