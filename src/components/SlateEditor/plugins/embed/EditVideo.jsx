import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SlateInputField from './SlateInputField';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { EmbedShape } from '../../../../shapes';

class EditVideo extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedEl.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderEl.style.height = `${embedRect.height / 2}px`;
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left}px`;
    embedEl.style.width = `${placeholderRect.width}px`;
  }

  render() {
    const {
      embed,
      submitted,
      onFigureInputChange,
      toggleEditModus,
      t,
    } = this.props;
    return (
      <React.Fragment>
        <Overlay onExit={toggleEditModus} />
        <div
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}>
          <Portal isOpened>
            <div
              ref={embedEl => {
                this.embedEl = embedEl;
              }}>
              <SlateInputField
                name="caption"
                label={t('form.video.caption.label')}
                type="text"
                required
                value={embed.caption}
                submitted={submitted}
                onChange={onFigureInputChange}
                placeholder={t('form.video.caption.placeholder')}
              />
            </div>
          </Portal>
        </div>
      </React.Fragment>
    );
  }
}

EditVideo.propTypes = {
  toggleEditModus: PropTypes.func,
  t: PropTypes.func,
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};

export default EditVideo;
