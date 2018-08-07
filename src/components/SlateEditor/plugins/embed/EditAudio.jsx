/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { bool, func, string } from 'prop-types';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import ObjectSelector from '../../../ObjectSelector';
import { EmbedShape } from '../../../../shapes';

import Overlay from '../../../Overlay';
import { Portal } from '../../../Portal';
import FigureButtons from './FigureButtons';
import SlateInputField from './SlateInputField';

const classes = new BEMHelper({
  name: 'audio-box',
  prefix: 'c-',
});

class EditAudio extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedEl.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderEl.style.height = `${embedRect.height + 120}px`;
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top + 50}px`;
    embedEl.style.left = `${placeholderRect.left + 100}px`;
    embedEl.style.width = `${placeholderRect.width - 200}px`;
  }

  render() {
    const {
      embed,
      onChange,
      onAudioFigureInputChange,
      locale,
      onExit,
      onRemoveClick,
      audioType,
      t,
      children,
      submitted,
    } = this.props;
    return (
      <Fragment>
        <Overlay onExit={onExit} key="audioOverlay" />
        <div
          key="audioPlaceholder"
          {...classes()}
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}
        />
        <Portal isOpened key="audioPortal">
          <div
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
            {children}
            <SlateInputField
              name="caption"
              label={t('form.audio.caption.label')}
              type="text"
              value={embed.caption}
              onChange={onAudioFigureInputChange}
              placeholder={t('form.audio.caption.placeholder')}
              submitted={submitted}
            />
          </div>
        </Portal>
        <FigureButtons
          key="audioFigureButtons"
          locale={locale}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="audio"
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
  locale: string,
  submitted: bool.isRequired,
  embed: EmbedShape.isRequired,
};

export default injectT(EditAudio);
