/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/core';
import React, { Component, Fragment } from 'react';
import { bool, func, string, shape, object } from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import { AudioPlayer } from '@ndla/ui';
import ObjectSelector from '../../../ObjectSelector';
import { EmbedShape } from '../../../../shapes';
import Overlay from '../../../Overlay';
import { Portal } from '../../../Portal';
import FigureButtons from './FigureButtons';

const placeholderStyle = css`
  position: relative;
  border: 1px solid var(--article-color);
`;

class EditAudio extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedEl.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderEl.style.height = `${embedRect.height + 120}px`;
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left}px`;
    embedEl.style.width = `${placeholderRect.width}px`;
  }

  render() {
    const {
      embed,
      onChange,
      onAudioFigureInputChange,
      onExit,
      onRemoveClick,
      audioType,
      t,
      speech,
      audio: {
        title,
        audioFile: { mimeType, url },
      },
      submitted,
    } = this.props;
    return (
      <Fragment>
        <Overlay onExit={onExit} key="audioOverlay" />
        <div
          key="audioPlaceholder"
          css={placeholderStyle}
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}
        />
        <Portal isOpened key="audioPortal">
          <div
            css={css`
              padding: 50px;
              background-color: white;
            `}
            ref={embedEl => {
              this.embedEl = embedEl;
            }}>
            <ObjectSelector
              onClick={e => e.stopPropagation()}
              onChange={onChange}
              onBlur={onChange}
              key="audioType"
              name="audioType"
              labelKey="label"
              idKey="id"
              value={audioType}
              options={[
                {
                  id: 'sound',
                  label: t('form.audio.sound'),
                },
                {
                  id: 'speech',
                  label: t('form.audio.speech'),
                },
              ]}
            />
            <AudioPlayer
              type={mimeType}
              src={url}
              title={title}
              speech={speech}
            />
            <Input
              name="caption"
              label={t('form.audio.caption.label')}
              container="div"
              type="text"
              value={embed.caption}
              onChange={onAudioFigureInputChange}
              placeholder={t('form.audio.caption.placeholder')}
              submitted={submitted}
            />
          </div>
        </Portal>
        <FigureButtons
          tooltip={t('form.audio.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
        />
      </Fragment>
    );
  }
}

EditAudio.propTypes = {
  onChange: func,
  onExit: func,
  onAudioFigureInputChange: func,
  audioType: string,
  onRemoveClick: func,
  submitted: bool.isRequired,
  embed: EmbedShape.isRequired,
  speech: bool,
  audio: shape({
    title: string,
    audioFile: object,
  }),
};

export default injectT(EditAudio);
