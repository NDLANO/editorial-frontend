import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import FocusTrapReact from 'focus-trap-react';
import { injectT } from '@ndla/i18n';
import { spacing, colors } from '@ndla/core';
import { FormInput } from '@ndla/forms';
import { isEmpty } from '../../../validators';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import { EmbedShape } from '../../../../shapes';

const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
`;

class EditImage extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    // Use section as reference to fetch embed size when previewing.
    const placeholderRect = placeholderEl.closest('section').getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${spacing.spacingUnit * 3 + placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${(placeholderRect.left + spacing.spacingUnit) - (placeholderRect.width * (0.333 / 2))}px`;
    embedEl.style.width = `${(placeholderRect.width * 1.333) - (spacing.spacingUnit * 2)}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height + (spacing.spacingUnit * 2)}px`;
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
            <FocusTrapReact
              focusTrapOptions={{
                onDeactivate: () => closeEdit(true),
                clickOutsideDeactivates: true,
                escapeDeactivates: true,
              }}
            >
              <div>
                <ImageEditor
                  embedTag={embed}
                  toggleEditModus={closeEdit}
                  {...this.props}
                />
                <StyledInputWrapper>
                  <FormInput
                    name="caption"
                    label={`${t('form.image.caption.label')}:`}
                    value={embed.caption}
                    onChange={onFigureInputChange}
                    container="div"
                    type="text"
                    autoExpand
                    placeholder={t('form.image.caption.placeholder')}
                    white
                  />
                  <FormInput
                    name="alt"
                    label={`${t('form.image.alt.label')}:`}
                    value={embed.alt}
                    onChange={onFigureInputChange}
                    container="div"
                    type="text"
                    autoExpand
                    placeholder={t('form.image.alt.placeholder')}
                    white
                    warningText={!submitted && isEmpty(embed.alt) ? t('form.image.alt.noText') : ''}
                  />
                </StyledInputWrapper>
              </div>
            </FocusTrapReact>
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

export default injectT(EditImage);
