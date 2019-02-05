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
  constructor(props) {
    super(props);
    this.state = {
      alt: props.embed.alt,
      caption: props.embed.caption,
    }
  }
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    // Use contenteditable as reference to fetch embed size when previewing.
    const placeholderRect = placeholderEl.closest('div[contenteditable="false"]').getBoundingClientRect();
    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${(placeholderRect.left + spacing.spacingUnit) - (placeholderRect.width * (0.333 / 2))}px`;
    embedEl.style.width = `${(placeholderRect.width * 1.333) - (spacing.spacingUnit * 2)}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height + (spacing.spacingUnit * 2)}px`;
  }

  onEdit(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    const { embed, onFigureInputMultipleUpdates, submitted, t, closeEdit } = this.props;

    return (
      <div
        ref={placeholderEl => {
          this.placeholderEl = placeholderEl;
        }}>
        <Portal isOpened>
          <FocusTrapReact
            focusTrapOptions={{
              onDeactivate: () => {
                onFigureInputMultipleUpdates(
                  {
                    caption: this.state.caption,
                    alt: this.state.alt,
                  }
                );
                closeEdit(true)
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}
          >
            <div
            ref={embedEl => {
              this.embedEl = embedEl;
            }}>
              <ImageEditor
                embedTag={embed}
                toggleEditModus={closeEdit}
                {...this.props}
              />
              <StyledInputWrapper>
                <FormInput
                  name="caption"
                  label={`${t('form.image.caption.label')}:`}
                  value={this.state.caption}
                  onChange={e => this.onEdit('caption', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.caption.placeholder')}
                  white
                />
                <FormInput
                  name="alt"
                  label={`${t('form.image.alt.label')}:`}
                  value={this.state.alt}
                  onChange={e => this.onEdit('alt', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.alt.placeholder')}
                  white
                  warningText={!submitted && isEmpty(this.state.alt) ? t('form.image.alt.noText') : ''}
                />
              </StyledInputWrapper>
            </div>
          </FocusTrapReact>
        </Portal>
      </div>
    );
  }
}

EditImage.propTypes = {
  closeEdit: PropTypes.func,
  embed: EmbedShape.isRequired,
  onFigureInputMultipleUpdates: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
};

export default injectT(EditImage);
