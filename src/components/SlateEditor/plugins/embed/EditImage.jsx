import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SlateInputField from './SlateInputField';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import { EmbedShape } from '../../../../shapes';

class EditImage extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left}px`;
    embedEl.style.width = `${placeholderRect.width}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height}px`;
  }

  render() {
    const { embed, onFigureInputChange, submitted, t, closeEdit } = this.props;
    return (
      <div
        ref={placeholderEl => {
          this.placeholderEl = placeholderEl;
        }}>
        <Portal isOpened>
          <div
            ref={embedEl => {
              this.embedEl = embedEl;
            }}>
            <ImageEditor
              embedTag={embed}
              toggleEditModus={closeEdit}
              {...this.props}
            />
            <SlateInputField
              name="caption"
              label={t('form.image.caption.label')}
              type="text"
              value={embed.caption}
              onChange={onFigureInputChange}
              placeholder={t('form.image.caption.placeholder')}
              submitted={submitted}
            />
            <SlateInputField
              name="alt"
              label={t('form.image.alt.label')}
              type="text"
              required
              value={embed.alt}
              onChange={onFigureInputChange}
              placeholder={t('form.image.alt.placeholder')}
              submitted={submitted}
            />
          </div>
        </Portal>
      </div>
    );
  }
}

EditImage.propTypes = {
  closeEdit: PropTypes.func,
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};

export default EditImage;
